-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'public',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  max_attendees INTEGER,
  registration_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create study_materials table
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  target_type TEXT NOT NULL DEFAULT 'all',
  target_roles TEXT[],
  target_user_ids UUID[],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Public events visible to all" ON public.events
  FOR SELECT USING (event_type = 'public' AND is_active = true);

CREATE POLICY "Role-specific events visible to matching roles" ON public.events
  FOR SELECT USING (
    is_active = true AND (
      event_type = 'public' OR
      EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = event_type
      )
    )
  );

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );

-- Study materials policies
CREATE POLICY "Users can view materials assigned to them" ON public.study_materials
  FOR SELECT USING (
    is_active = true AND (
      target_type = 'all' OR
      (target_type = 'role' AND EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = ANY(target_roles)
      )) OR
      (target_type = 'user' AND auth.uid() = ANY(target_user_ids))
    )
  );

CREATE POLICY "Admins can manage all study materials" ON public.study_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );

-- Create study-materials storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for study materials
CREATE POLICY "Admins can upload study materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'study-materials' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );

CREATE POLICY "Users can download assigned study materials" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'study-materials'
  );

CREATE POLICY "Admins can delete study materials" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'study-materials' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('superadmin', 'admin', 'platform_admin')
    )
  );