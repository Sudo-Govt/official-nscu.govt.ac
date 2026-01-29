-- Create a separate dummy_alumni table without FK constraints
CREATE TABLE IF NOT EXISTS public.dummy_alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  graduation_year INTEGER,
  program TEXT,
  degree_type TEXT,
  college TEXT,
  major TEXT,
  current_company TEXT,
  current_position TEXT,
  location TEXT,
  is_mentor_available BOOLEAN DEFAULT false,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dummy_alumni ENABLE ROW LEVEL SECURITY;

-- Everyone can view dummy alumni (they're just display data)
CREATE POLICY "Anyone can view dummy alumni"
  ON public.dummy_alumni FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage dummy alumni"
  ON public.dummy_alumni FOR ALL
  USING (public.is_admin(auth.uid()));

-- Insert 200 dummy alumni
INSERT INTO public.dummy_alumni (full_name, graduation_year, program, degree_type, college, major, current_company, current_position, location, is_mentor_available, bio)
SELECT 
  (ARRAY['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'])[1 + (i % 20)] || ' ' ||
  (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'])[1 + ((i * 7) % 20)],
  2010 + (i % 14),
  (ARRAY['Computer Science', 'Business Administration', 'Mechanical Engineering', 'Medicine', 'Law', 'Economics', 'Psychology', 'Chemistry', 'Physics', 'Biology'])[1 + (i % 10)],
  (ARRAY['Bachelor''s', 'Master''s', 'PhD', 'MBA', 'JD', 'MD'])[1 + (i % 6)],
  (ARRAY['College of Engineering', 'School of Business', 'School of Medicine', 'College of Arts & Sciences', 'School of Law'])[1 + (i % 5)],
  (ARRAY['Software Engineering', 'Finance', 'Marketing', 'Healthcare', 'Data Science', 'Operations', 'Research', 'Consulting'])[1 + (i % 8)],
  (ARRAY['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Goldman Sachs', 'McKinsey', 'Deloitte', 'JPMorgan', 'Tesla', 'SpaceX', 'Netflix', 'Uber', 'Airbnb', 'Stripe'])[1 + (i % 15)],
  (ARRAY['Software Engineer', 'Product Manager', 'Data Scientist', 'VP Engineering', 'Director', 'Senior Analyst', 'Managing Consultant', 'Research Scientist', 'CEO', 'CTO', 'CFO', 'Partner'])[1 + (i % 12)],
  (ARRAY['New York, USA', 'San Francisco, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Singapore', 'Dubai, UAE', 'Toronto, Canada', 'Berlin, Germany', 'Paris, France'])[1 + (i % 10)],
  i % 2 = 0,
  'Distinguished NSCU alumnus with extensive experience in the industry. Class of ' || (2010 + (i % 14)) || '.'
FROM generate_series(1, 200) as i;