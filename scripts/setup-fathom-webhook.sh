#!/bin/bash
# =============================================
# Fathom Webhook Setup for IndieCode Studio
# =============================================
# This script registers a webhook with Fathom AI
# and configures Supabase secrets.
#
# Prerequisites:
#   1. Fathom API key (from fathom.video/customize#api-access-header)
#   2. Supabase CLI installed and linked to your project
#
# Usage:
#   chmod +x scripts/setup-fathom-webhook.sh
#   ./scripts/setup-fathom-webhook.sh
# =============================================

set -e

# Configuration
FATHOM_API_KEY="1d3Q4nqS-M42e2y6XGS6sA.cDr2_PU_D-XuSu2Ly3IEYCUFfHwjHRvQwvA37xh1jiI"
SUPABASE_FUNCTION_URL="https://lrrpyscbawoidofyfcbl.supabase.co/functions/v1/fathom-webhook"
STUDIO_OWNER_USER_ID="5ca76fd1-3cc9-482b-9224-2701d05d4a16"

echo "🎯 IndieCode Studio — Fathom Webhook Setup"
echo "============================================"
echo ""

# Step 1: Register webhook with Fathom
echo "📡 Step 1: Registering webhook with Fathom..."
echo "   Destination: $SUPABASE_FUNCTION_URL"
echo ""

RESPONSE=$(curl -s --request POST \
  --url https://api.fathom.ai/external/v1/webhooks \
  --header 'Content-Type: application/json' \
  --header "X-Api-Key: $FATHOM_API_KEY" \
  --data "{
    \"destination_url\": \"$SUPABASE_FUNCTION_URL\",
    \"triggered_for\": [\"my_recordings\"],
    \"include_summary\": true,
    \"include_transcript\": true,
    \"include_action_items\": true
  }")

echo "Response from Fathom:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Extract webhook secret from response
WEBHOOK_SECRET=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['secret'])" 2>/dev/null)

if [ -n "$WEBHOOK_SECRET" ]; then
  echo "✅ Webhook registered successfully!"
  echo "   Webhook Secret: $WEBHOOK_SECRET"
  echo ""
  
  # Step 2: Set Supabase secrets
  echo "🔐 Step 2: Setting Supabase secrets..."
  echo "   Run these commands to set your secrets:"
  echo ""
  echo "   supabase secrets set FATHOM_WEBHOOK_SECRET=$WEBHOOK_SECRET"
  echo "   supabase secrets set STUDIO_OWNER_USER_ID=$STUDIO_OWNER_USER_ID"
  echo ""
  echo "   Or if you already have a webhook secret from .env:"
  echo "   supabase secrets set FATHOM_WEBHOOK_SECRET=whsec_aBRTEM5NkOIA27BzmJ2+s5TGk6JFIqQw"
  echo "   supabase secrets set STUDIO_OWNER_USER_ID=5ca76fd1-3cc9-482b-9224-2701d05d4a16"
else
  echo "⚠️  Could not extract webhook secret from response."
  echo "   You may already have a webhook registered."
  echo "   Check your .env file for the Fathom_Webhook_Secret value."
  echo ""
  echo "   To set secrets manually, run:"
  echo "   supabase secrets set FATHOM_WEBHOOK_SECRET=whsec_aBRTEM5NkOIA27BzmJ2+s5TGk6JFIqQw"
  echo "   supabase secrets set STUDIO_OWNER_USER_ID=5ca76fd1-3cc9-482b-9224-2701d05d4a16"
fi

echo ""
echo "🚀 Step 3: Deploy the edge function:"
echo "   supabase functions deploy fathom-webhook --no-verify-jwt"
echo ""
echo "✅ Setup complete! After deployment, Fathom will automatically"
echo "   send meeting summaries to your Studio when strategy calls end."
