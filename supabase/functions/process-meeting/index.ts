import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

Deno.serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { transcript, projectId, userId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("Missing GEMINI_API_KEY in Supabase Secrets");

    console.log(`Processing meeting for project: ${projectId || 'New Project'}`);

    // Call Gemini with Fallback Logic
    const prompt = `
      You are an expert Project Manager. Analyze the following meeting transcript and extract project details.
      
      TRANSCRIPT:
      """
      ${transcript}
      """
      
      Return a JSON object with the following fields:
      - name: A professional name for the project.
      - description: A concise summary of the project goals.
      - requirements: A detailed markdown string covering all technical and functional requirements discussed.
      - phases: An array of objects with { name: string, status: "Todo", progress: 0 } representing the development stages.
      - milestones: An array of objects with { name: string, date: string (YYYY-MM-DD), status: "Pending" } representing key delivery dates. Use reasonable estimates for dates starting from today.
      
      Response must be ONLY valid JSON.
    `;

    // Modern 2026 Model IDs (Preview)
    const models = [
      "gemini-3-flash-preview", 
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash" // Last resort fallback
    ];
    
    let geminiData;
    let lastError;

    for (const model of models) {
      try {
        console.log(`Attempting with model: ${model}`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const data = await response.json();
        
        if (data.error) {
          console.warn(`Model ${model} failed: ${data.error.message}`);
          lastError = `${model}: ${data.error.message}`;
          continue; // Try next model
        }

        if (!data.candidates || data.candidates.length === 0) {
          console.warn(`Model ${model} returned no candidates`);
          lastError = `${model}: No candidates returned`;
          continue;
        }

        geminiData = data;
        console.log(`Success with model: ${model}`);
        break; // Success!
      } catch (err) {
        console.error(`Fetch error with model ${model}:`, err.message);
        lastError = `${model}: ${err.message}`;
      }
    }

    if (!geminiData) {
      throw new Error(`Gemini API Error (All models failed): ${lastError}`);
    }
    
    const resultText = geminiData.candidates[0].content.parts[0].text;
    // Clean up markdown code blocks if the model includes them
    const cleanJson = resultText.replace(/```json\n?|```/g, '').trim();
    const result = JSON.parse(cleanJson);

    // Upsert Project
    let projectData;
    if (projectId) {
      const { data, error } = await supabase
        .from('projects')
        .update({
          description: result.description,
          phases: result.phases,
          milestones: result.milestones,
        })
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      projectData = data;
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: result.name,
          description: result.description,
          status: 'Active',
          progress: 0,
          phases: result.phases,
          milestones: result.milestones,
          user_id: userId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      projectData = data;
    }

    // Requirements File
    if (result.requirements) {
      const folderName = projectData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `requirements_${Date.now()}.md`;
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, result.requirements, {
          contentType: 'text/markdown',
          upsert: true
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath);

        const newResource = {
          id: crypto.randomUUID(),
          name: "Project Requirements (AI Generated)",
          type: "file",
          url: publicUrl,
          storagePath: filePath,
          added_by: "AI Assistant",
          created_at: new Date().toISOString(),
          size: `${(result.requirements.length / 1024).toFixed(1)} KB`
        };

        const updatedResources = [...(projectData.resources || []), newResource];
        await supabase
          .from('projects')
          .update({ resources: updatedResources })
          .eq('id', projectData.id);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      projectId: projectData.id 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (err) {
    console.error("Error in process-meeting:", err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
