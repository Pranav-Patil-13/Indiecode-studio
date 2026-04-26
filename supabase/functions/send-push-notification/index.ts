import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { JWT } from "npm:google-auth-library"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { targetUserId, title, body, data } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Get Service Account from Env
    const serviceAccountKey = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountKey) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
    const serviceAccount = JSON.parse(serviceAccountKey);

    // 2. Get tokens for the target user (by email or user_id)
    const { data: tokens, error: tokenError } = await supabase
      .from("user_push_tokens")
      .select("token")
      .or(`user_id.eq.${targetUserId},email.eq.${targetUserId}`);

    if (tokenError) throw tokenError;
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "No tokens found" }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // 3. Get Google OAuth2 Access Token
    const jwtClient = new JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/firebase.messaging']
    );

    const authResponse = await jwtClient.getAccessToken();
    const accessToken = authResponse.token;

    // 4. Send notifications via REST API
    const project_id = serviceAccount.project_id;
    const fcm_url = `https://fcm.googleapis.com/v1/projects/${project_id}/messages:send`;

    const results = await Promise.all(tokens.map(async (t) => {
      const message = {
        message: {
          token: t.token,
          notification: { title, body },
          data: data || {},
        }
      };

      const res = await fetch(fcm_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      });

      return res.json();
    }));
    
    return new Response(JSON.stringify({ success: true, results }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (err) {
    console.error("Error in send-push-notification:", err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
