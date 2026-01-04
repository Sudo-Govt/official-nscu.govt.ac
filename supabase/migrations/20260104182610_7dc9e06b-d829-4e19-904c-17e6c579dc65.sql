-- Seed existing programs into courses table
INSERT INTO public.courses (
  course_code, course_name, degree_type, college, department, 
  duration_years, credit_hours, seat_capacity, available_seats,
  eligibility_criteria, description, slug, featured, is_active,
  navigation_parent_id
) VALUES
-- Bachelor Programs
('BSC-BIO', 'Biology', 'Bachelor of Science', 'College of Arts and Sciences', 'Biology',
 4, 120, 150, 150, 'High school diploma with strong science background',
 'Comprehensive study of living organisms and biological systems.', 'bachelor-science-biology', true, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('BA-ENG', 'English', 'Bachelor of Arts', 'College of Arts and Sciences', 'English Literature',
 4, 120, 100, 100, 'High school diploma',
 'In-depth study of English language, literature, and creative writing.', 'bachelor-arts-english', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('BE-GEN', 'Engineering', 'Bachelor of Engineering', 'College of Engineering', 'Engineering',
 4, 160, 200, 200, 'High school diploma with mathematics and physics',
 'Comprehensive engineering program with multiple specializations.', 'bachelor-engineering', true, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('BFA-GEN', 'Fine Arts', 'Bachelor of Fine Arts', 'School of Arts', 'Fine Arts',
 4, 120, 80, 80, 'High school diploma and portfolio review',
 'Creative arts program focusing on visual arts and design.', 'bachelor-fine-arts', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('BSN-NUR', 'Nursing', 'Bachelor of Science in Nursing', 'College of Health Sciences', 'Nursing',
 4, 128, 120, 120, 'High school diploma with biology and chemistry',
 'Comprehensive nursing education preparing students for healthcare careers.', 'bachelor-nursing', true, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('BPHAR', 'Pharmacy', 'Bachelor of Pharmacy', 'College of Health Sciences', 'Pharmacy',
 4, 140, 100, 100, 'High school diploma with strong science background',
 'Foundation in pharmaceutical sciences and patient care.', 'bachelor-pharmacy', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

-- Master Programs
('MBA', 'Business Administration', 'Master of Business Administration', 'School of Business', 'Business Administration',
 2, 60, 150, 150, 'Bachelor degree with work experience preferred',
 'Advanced business education with leadership and management focus.', 'master-business-administration', true, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('MA-HIST', 'Arts History', 'Master of Arts', 'College of Arts and Sciences', 'History',
 2, 36, 50, 50, 'Bachelor degree in related field',
 'Advanced study of historical periods, methodologies, and research.', 'master-arts-history', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('MFA-CW', 'Fine Arts Creative Writing', 'Master of Fine Arts', 'School of Arts', 'Creative Writing',
 2, 48, 30, 30, 'Bachelor degree and writing portfolio',
 'Advanced creative writing program with workshop-based instruction.', 'master-fine-arts-creative-writing', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('MSW', 'Social Work', 'Master of Social Work', 'School of Social Work', 'Social Work',
 2, 60, 80, 80, 'Bachelor degree in social work or related field',
 'Advanced social work education with clinical and community practice.', 'master-social-work', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('MM', 'Medicine', 'Master of Medicine', 'School of Medicine', 'Medicine',
 2, 72, 60, 60, 'Medical degree (MBBS/MD) required',
 'Advanced medical specialization and research training.', 'master-medicine', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('MPHAR', 'Pharmacy', 'Master of Pharmacy', 'College of Health Sciences', 'Pharmacy',
 2, 48, 50, 50, 'Bachelor of Pharmacy degree',
 'Advanced pharmaceutical sciences and clinical practice.', 'master-pharmacy', false, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

-- Doctoral Programs
('MD', 'Medicine', 'Doctor of Medicine', 'School of Medicine', 'Medicine',
 4, 240, 100, 100, 'Bachelor degree in pre-medicine or equivalent',
 'Comprehensive medical education preparing physicians for clinical practice.', 'doctor-medicine', true, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1)),

('PHARMD', 'Pharmacy', 'Doctor of Pharmacy', 'College of Health Sciences', 'Pharmacy',
 4, 200, 80, 80, 'Bachelor degree with pre-pharmacy requirements',
 'Advanced pharmacy doctorate preparing clinical pharmacists.', 'doctor-pharmacy', true, true,
 (SELECT id FROM public.site_navigation WHERE href = '/academics/course-catalog' LIMIT 1))

ON CONFLICT (course_code) DO NOTHING;