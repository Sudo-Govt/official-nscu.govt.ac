-- Queue table for bulk content generation
CREATE TABLE IF NOT EXISTS public.content_generation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.academic_courses(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'paused')),
  priority INTEGER DEFAULT 10,
  retries INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(course_id)
);

-- Notifications table for tracking generation results
CREATE TABLE IF NOT EXISTS public.content_generation_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_item_id UUID REFERENCES public.content_generation_queue(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'paused')),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Queue status tracking table (for pause/resume state)
CREATE TABLE IF NOT EXISTS public.content_generation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default queue settings
INSERT INTO public.content_generation_settings (key, value)
VALUES ('queue_status', '{"status": "idle", "pausedAt": null, "pauseReason": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_generation_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_generation_notifications;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_queue_status ON public.content_generation_queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_priority_created ON public.content_generation_queue(priority, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.content_generation_notifications(user_id, is_read);

-- Enable RLS
ALTER TABLE public.content_generation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generation_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generation_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can manage queue
CREATE POLICY "Admins can manage queue"
  ON public.content_generation_queue FOR ALL
  USING (public.is_admin(auth.uid()));

-- Notifications: Users can view and update their own
CREATE POLICY "Users can view their notifications"
  ON public.content_generation_notifications FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their notifications"
  ON public.content_generation_notifications FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert notifications"
  ON public.content_generation_notifications FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Settings: Only admins
CREATE POLICY "Admins can manage settings"
  ON public.content_generation_settings FOR ALL
  USING (public.is_admin(auth.uid()));