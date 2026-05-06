-- ============================================
-- Fathom Webhook Integration — Database Setup
-- ============================================

-- 1. Webhook audit/tracking table
CREATE TABLE IF NOT EXISTS public.fathom_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    fathom_meeting_title TEXT,
    fathom_url TEXT,
    fathom_share_url TEXT,
    fathom_recording_id TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'processed',  -- 'processed', 'failed', 'skipped'
    error_message TEXT,
    raw_payload JSONB
);

-- 2. Add source tracking columns to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS fathom_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS fathom_meeting_title TEXT;

-- 3. RLS for fathom_webhooks
ALTER TABLE public.fathom_webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.fathom_webhooks;
CREATE POLICY "Allow all for authenticated users" ON public.fathom_webhooks 
  FOR ALL USING (auth.role() = 'authenticated');

-- 4. Allow service role (edge functions) to bypass RLS
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS automatically.
-- This policy ensures the frontend can also read webhook logs.

-- 5. Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_fathom_webhooks_status ON public.fathom_webhooks(status);
CREATE INDEX IF NOT EXISTS idx_projects_source ON public.projects(source);
