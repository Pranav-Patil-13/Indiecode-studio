import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { encode as base64Encode, decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// ─── Webhook Signature Verification ───
async function verifyWebhookSignature(
  secret: string, 
  webhookId: string, 
  webhookTimestamp: string, 
  rawBody: string, 
  webhookSignature: string
): Promise<boolean> {
  // Check timestamp tolerance (5 minutes)
  const timestamp = parseInt(webhookTimestamp, 10);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTimestamp - timestamp) > 300) {
    console.warn("Webhook timestamp too old or too new");
    return false;
  }

  // Construct signed content: ${id}.${timestamp}.${body}
  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

  // Decode secret (strip "whsec_" prefix, then base64 decode)
  const secretPart = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const secretBytes = base64Decode(secretPart);

  // HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedContent)
  );
  const expectedSignature = base64Encode(new Uint8Array(signatureBytes));

  // Extract signatures from header (format: "v1,<base64>" possibly space-delimited)
  const signatures = webhookSignature.split(" ").map(sig => {
    const parts = sig.split(",");
    return parts.length > 1 ? parts[1] : parts[0];
  });

  return signatures.some(sig => sig === expectedSignature);
}

// ─── Strategy Meeting Filter ───
function isStrategyMeeting(payload: any): boolean {
  const title = (payload.title || "").toLowerCase();
  const meetingTitle = (payload.meeting_title || "").toLowerCase();
  
  const strategyKeywords = [
    "strategy", "strategic", "discovery", "consultation",
    "requirements", "kickoff", "kick-off", "onboarding",
    "project planning", "scope", "proposal"
  ];
  
  return strategyKeywords.some(keyword => 
    title.includes(keyword) || meetingTitle.includes(keyword)
  );
}

// ─── Build transcript text from Fathom format ───
function buildTranscriptText(payload: any): string {
  const parts: string[] = [];

  // Include the summary if available
  if (payload.default_summary?.markdown_formatted) {
    parts.push("=== MEETING SUMMARY ===");
    parts.push(payload.default_summary.markdown_formatted);
    parts.push("");
  }

  // Include action items
  if (payload.action_items && payload.action_items.length > 0) {
    parts.push("=== ACTION ITEMS ===");
    payload.action_items.forEach((item: any) => {
      parts.push(`- ${item.description}${item.assignee ? ` (Assigned to: ${item.assignee.name})` : ""}`);
    });
    parts.push("");
  }

  // Include full transcript
  if (payload.transcript && payload.transcript.length > 0) {
    parts.push("=== FULL TRANSCRIPT ===");
    payload.transcript.forEach((entry: any) => {
      const speaker = entry.speaker?.display_name || "Unknown";
      parts.push(`[${entry.timestamp}] ${speaker}: ${entry.text}`);
    });
  }

  // Include attendee context
  if (payload.calendar_invitees && payload.calendar_invitees.length > 0) {
    parts.push("");
    parts.push("=== ATTENDEES ===");
    payload.calendar_invitees.forEach((inv: any) => {
      parts.push(`- ${inv.name} (${inv.email}) ${inv.is_external ? "[External Client]" : "[Internal]"}`);
    });
  }

  return parts.join("\n");
}

Deno.serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Read raw body BEFORE parsing (needed for signature verification)
  const rawBody = await req.text();
  let payload: any;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("Failed to parse webhook body");
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { 
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  try {
    // ─── Step 1: Verify Webhook Signature ───
    const webhookSecret = Deno.env.get("FATHOM_WEBHOOK_SECRET");
    if (webhookSecret) {
      const webhookId = req.headers.get("webhook-id") || "";
      const webhookTimestamp = req.headers.get("webhook-timestamp") || "";
      const webhookSignature = req.headers.get("webhook-signature") || "";

      if (!webhookId || !webhookTimestamp || !webhookSignature) {
        console.warn("Missing webhook verification headers — skipping verification for test payloads");
      } else {
        const isValid = await verifyWebhookSignature(
          webhookSecret, webhookId, webhookTimestamp, rawBody, webhookSignature
        );

        if (!isValid) {
          console.error("Webhook signature verification FAILED");
          // Log the failed attempt
          await supabase.from('fathom_webhooks').insert({
            fathom_meeting_title: payload.meeting_title || payload.title,
            fathom_url: payload.url,
            status: 'failed',
            error_message: 'Signature verification failed',
            raw_payload: payload
          });
          return new Response(JSON.stringify({ error: "Invalid signature" }), { 
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
        console.log("✅ Webhook signature verified");
      }
    }

    // ─── Step 2: Filter — Only process strategy meetings ───
    if (!isStrategyMeeting(payload)) {
      console.log(`⏭️ Skipping non-strategy meeting: "${payload.meeting_title || payload.title}"`);
      
      // Log as skipped
      await supabase.from('fathom_webhooks').insert({
        fathom_meeting_title: payload.meeting_title || payload.title,
        fathom_url: payload.url,
        fathom_share_url: payload.share_url,
        fathom_recording_id: payload.recording_id?.toString(),
        status: 'skipped',
        error_message: 'Not a strategy meeting',
        raw_payload: payload
      });

      return new Response(JSON.stringify({ 
        success: true, 
        action: 'skipped', 
        reason: 'Not a strategy meeting' 
      }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log(`🎯 Strategy meeting detected: "${payload.meeting_title || payload.title}"`);

    // ─── Step 3: Build transcript text ───
    const transcript = buildTranscriptText(payload);
    
    if (!transcript || transcript.length < 50) {
      throw new Error("Transcript/summary too short to generate a meaningful project");
    }

    // ─── Step 4: Call Gemini AI (same logic as process-meeting) ───
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("Missing GEMINI_API_KEY in Supabase Secrets");

    const ownerUserId = Deno.env.get("STUDIO_OWNER_USER_ID");
    if (!ownerUserId) throw new Error("Missing STUDIO_OWNER_USER_ID in Supabase Secrets");

    const prompt = `
      You are an expert Project Manager. Analyze the following meeting transcript and extract project details.
      This is from a strategy/discovery call with a potential client.
      
      MEETING TITLE: "${payload.meeting_title || payload.title}"
      ATTENDEES: ${(payload.calendar_invitees || []).map((i: any) => `${i.name} (${i.email})`).join(", ")}
      
      TRANSCRIPT:
      """
      ${transcript}
      """
      
      Return a JSON object with the following fields:
      - name: A professional name for the project (based on the discussion, NOT the meeting title).
      - description: A concise summary of the project goals.
      - requirements: A detailed markdown string covering all technical and functional requirements discussed.
      - phases: An array of objects with { name: string, status: "Todo", progress: 0 } representing the development stages.
      - milestones: An array of objects with { name: string, date: string (YYYY-MM-DD), status: "Pending" } representing key delivery dates. Use reasonable estimates for dates starting from today.
      - client_name: The external client's name if identifiable from attendees.
      - client_email: The external client's email if identifiable.
      
      Response must be ONLY valid JSON.
    `;

    const models = [
      "gemini-3-flash-preview", 
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash"
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
          continue;
        }

        if (!data.candidates || data.candidates.length === 0) {
          console.warn(`Model ${model} returned no candidates`);
          lastError = `${model}: No candidates returned`;
          continue;
        }

        geminiData = data;
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (err) {
        console.error(`Fetch error with model ${model}:`, err.message);
        lastError = `${model}: ${err.message}`;
      }
    }

    if (!geminiData) {
      throw new Error(`Gemini API Error (All models failed): ${lastError}`);
    }
    
    const resultText = geminiData.candidates[0].content.parts[0].text;
    const cleanJson = resultText.replace(/```json\n?|```/g, '').trim();
    const result = JSON.parse(cleanJson);

    // ─── Step 5: Create Project in Database ───
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: result.name || payload.meeting_title || "Untitled Project",
        description: result.description || "",
        status: 'Active',
        progress: 0,
        phases: result.phases || [],
        milestones: result.milestones || [],
        user_id: ownerUserId,
        source: 'fathom_webhook',
        fathom_url: payload.url || null,
        fathom_meeting_title: payload.meeting_title || payload.title || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (projectError) throw projectError;
    console.log(`✅ Project created: ${projectData.id} — "${projectData.name}"`);

    // ─── Step 6: Upload Requirements File ───
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
          name: "Project Requirements (Auto-Generated from Meeting)",
          type: "file",
          url: publicUrl,
          storagePath: filePath,
          added_by: "Fathom AI Pipeline",
          created_at: new Date().toISOString(),
          size: `${(result.requirements.length / 1024).toFixed(1)} KB`
        };

        await supabase
          .from('projects')
          .update({ resources: [newResource] })
          .eq('id', projectData.id);

        console.log("✅ Requirements file uploaded");
      } else {
        console.warn("⚠️ Failed to upload requirements:", uploadError.message);
      }
    }

    // ─── Step 7: Create Notification ───
    await supabase.from('notifications').insert({
      title: '🎯 Project Auto-Created from Meeting',
      message: `"${projectData.name}" was automatically created from your strategy call: "${payload.meeting_title || payload.title}"`,
      type: 'meeting',
      unread: true,
      user_id: ownerUserId,
      created_at: new Date().toISOString()
    });

    // ─── Step 8: Log Webhook Event ───
    await supabase.from('fathom_webhooks').insert({
      fathom_meeting_title: payload.meeting_title || payload.title,
      fathom_url: payload.url,
      fathom_share_url: payload.share_url,
      fathom_recording_id: payload.recording_id?.toString(),
      project_id: projectData.id,
      status: 'processed',
      raw_payload: payload
    });

    console.log("🎉 Full pipeline complete!");

    return new Response(JSON.stringify({ 
      success: true, 
      projectId: projectData.id,
      projectName: projectData.name
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (err) {
    console.error("❌ Error in fathom-webhook:", err.message);

    // Log the failure
    try {
      await supabase.from('fathom_webhooks').insert({
        fathom_meeting_title: payload?.meeting_title || payload?.title,
        fathom_url: payload?.url,
        status: 'failed',
        error_message: err.message,
        raw_payload: payload
      });
    } catch { /* best effort logging */ }

    return new Response(JSON.stringify({ success: false, error: err.message }), { 
      status: 200, // Return 200 to prevent Fathom retries on permanent failures
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
