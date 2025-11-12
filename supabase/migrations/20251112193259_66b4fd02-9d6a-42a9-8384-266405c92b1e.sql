-- Create remaining alumni tables

-- Create alumni_credentials table
CREATE TABLE IF NOT EXISTS public.alumni_credentials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  credential_type text NOT NULL,
  credential_number text,
  issued_at timestamptz,
  expires_at timestamptz,
  file_path text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.alumni_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credentials" ON public.alumni_credentials FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage credentials" ON public.alumni_credentials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Create alumni_profiles table
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  graduation_year integer,
  program text,
  degree_type text,
  college text,
  major text,
  current_employer text,
  current_position text,
  industry text,
  location text,
  linkedin_url text,
  bio text,
  is_mentor_available boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view alumni profiles" ON public.alumni_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.alumni_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can create their own profile" ON public.alumni_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create alumni_chapters table
CREATE TABLE IF NOT EXISTS public.alumni_chapters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  location text NOT NULL,
  description text,
  president_id uuid REFERENCES auth.users,
  contact_email text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.alumni_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active chapters" ON public.alumni_chapters FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage chapters" ON public.alumni_chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Add trigger for alumni_profiles updated_at
CREATE TRIGGER update_alumni_profiles_updated_at 
  BEFORE UPDATE ON public.alumni_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();