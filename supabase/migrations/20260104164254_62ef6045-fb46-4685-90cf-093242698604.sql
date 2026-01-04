-- Site Navigation Table
CREATE TABLE public.site_navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.site_navigation(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  href TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  menu_location TEXT NOT NULL DEFAULT 'main',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CMS Templates Table
CREATE TABLE public.cms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  layout_structure JSONB DEFAULT '[]'::jsonb,
  default_blocks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CMS Pages Table
CREATE TABLE public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  page_type TEXT NOT NULL DEFAULT 'template',
  template_id UUID REFERENCES public.cms_templates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CMS Content Blocks Table
CREATE TABLE public.cms_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  block_key TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  content JSONB DEFAULT '{}'::jsonb,
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_navigation
CREATE POLICY "Anyone can view active navigation"
ON public.site_navigation FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage navigation"
ON public.site_navigation FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role IN ('admin', 'superadmin')
));

-- RLS Policies for cms_templates
CREATE POLICY "Anyone can view templates"
ON public.cms_templates FOR SELECT
USING (true);

CREATE POLICY "Admins can manage templates"
ON public.cms_templates FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role IN ('admin', 'superadmin')
));

-- RLS Policies for cms_pages
CREATE POLICY "Anyone can view published pages"
ON public.cms_pages FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all pages"
ON public.cms_pages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role IN ('admin', 'superadmin')
));

CREATE POLICY "Admins can manage pages"
ON public.cms_pages FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role IN ('admin', 'superadmin')
));

-- RLS Policies for cms_content_blocks
CREATE POLICY "Anyone can view active blocks"
ON public.cms_content_blocks FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage content blocks"
ON public.cms_content_blocks FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role IN ('admin', 'superadmin')
));

-- Insert default templates
INSERT INTO public.cms_templates (name, description, layout_structure, default_blocks) VALUES
('School Intro', 'Template for school/college intro pages with stats, departments, and programs', 
 '["hero_stats", "overview", "departments", "research_centers", "programs", "alumni"]'::jsonb,
 '[{"type": "hero_stats", "fields": ["stat1", "stat2", "stat3", "stat4"]}, {"type": "overview", "fields": ["heading", "paragraph", "sidebar_blocks"]}, {"type": "departments", "fields": ["title", "items"]}, {"type": "programs", "fields": ["title", "items"]}]'::jsonb),
('Course Detail', 'Template for individual course/program pages',
 '["hero", "overview", "curriculum", "faculty", "careers", "apply"]'::jsonb,
 '[{"type": "hero", "fields": ["title", "subtitle", "image"]}, {"type": "overview", "fields": ["description", "duration", "credits"]}, {"type": "curriculum", "fields": ["semesters"]}]'::jsonb),
('General Content', 'Simple content page with title and body',
 '["hero", "content", "sidebar"]'::jsonb,
 '[{"type": "hero", "fields": ["title", "subtitle"]}, {"type": "content", "fields": ["body"]}]'::jsonb),
('Landing Page', 'Marketing landing page with hero, features, CTA',
 '["hero", "features", "testimonials", "cta"]'::jsonb,
 '[{"type": "hero", "fields": ["title", "subtitle", "cta_text", "cta_link"]}, {"type": "features", "fields": ["items"]}]'::jsonb);

-- Create indexes for performance
CREATE INDEX idx_site_navigation_parent ON public.site_navigation(parent_id);
CREATE INDEX idx_site_navigation_location ON public.site_navigation(menu_location);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON public.cms_pages(status);
CREATE INDEX idx_cms_content_blocks_page ON public.cms_content_blocks(page_id);