-- Create student_dashboard_data table to store editable student dashboard information
CREATE TABLE public.student_dashboard_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  
  -- Courses data (JSON array of course objects)
  courses JSONB DEFAULT '[]'::jsonb,
  
  -- Grades data (JSON array of grade objects)
  grades JSONB DEFAULT '[]'::jsonb,
  
  -- Assignments data (JSON array of assignment objects)
  assignments JSONB DEFAULT '[]'::jsonb,
  
  -- Schedule data (JSON array of schedule items)
  schedule JSONB DEFAULT '[]'::jsonb,
  
  -- Library resources (JSON array)
  library_resources JSONB DEFAULT '[]'::jsonb,
  
  -- Financial overview data
  financial_data JSONB DEFAULT '{
    "total_due": 0,
    "amount_paid": 0,
    "due_date": null,
    "has_financial_aid": false,
    "meal_plan_balance": 0,
    "print_credits": 0
  }'::jsonb,
  
  -- Degree progress data
  degree_progress JSONB DEFAULT '{
    "total_credits_earned": 0,
    "total_credits_required": 120,
    "expected_graduation": null,
    "categories": []
  }'::jsonb,
  
  -- GPA data
  gpa_data JSONB DEFAULT '{
    "cumulative_gpa": 0,
    "semester_gpa": 0,
    "is_deans_list": false
  }'::jsonb,
  
  -- Quick actions configuration (which actions are enabled)
  quick_actions_config JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(student_id)
);

-- Enable Row Level Security
ALTER TABLE public.student_dashboard_data ENABLE ROW LEVEL SECURITY;

-- Students can view their own dashboard data
CREATE POLICY "Students can view their own dashboard data"
ON public.student_dashboard_data
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_dashboard_data.student_id 
    AND s.user_id = auth.uid()
  )
);

-- Super admins can view all dashboard data
CREATE POLICY "Super admins can view all dashboard data"
ON public.student_dashboard_data
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Super admins can insert dashboard data
CREATE POLICY "Super admins can insert dashboard data"
ON public.student_dashboard_data
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Super admins can update dashboard data
CREATE POLICY "Super admins can update dashboard data"
ON public.student_dashboard_data
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Super admins can delete dashboard data
CREATE POLICY "Super admins can delete dashboard data"
ON public.student_dashboard_data
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_dashboard_data_updated_at
BEFORE UPDATE ON public.student_dashboard_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_student_dashboard_data_student_id ON public.student_dashboard_data(student_id);