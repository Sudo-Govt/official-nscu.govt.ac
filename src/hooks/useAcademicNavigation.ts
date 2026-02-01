import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AcademicNavFaculty {
  id: string;
  name: string;
  slug: string;
  code: string;
  departments: AcademicNavDepartment[];
}

export interface AcademicNavDepartment {
  id: string;
  name: string;
  slug: string;
  code: string;
  faculty_id: string;
  coursesByLevel: {
    certificate: AcademicNavCourse[];
    undergraduate: AcademicNavCourse[];
    postgraduate: AcademicNavCourse[];
    doctoral: AcademicNavCourse[];
  };
}

export interface AcademicNavCourse {
  id: string;
  name: string;
  slug: string;
  course_code: string;
  degree_level: string;
}

export function useAcademicNavigation() {
  const [faculties, setFaculties] = useState<AcademicNavFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAcademicHierarchy();
  }, []);

  const fetchAcademicHierarchy = async () => {
    try {
      setLoading(true);
      
      // Fetch all active faculties
      const { data: facultiesData, error: facultiesError } = await supabase
        .from('academic_faculties')
        .select('id, name, slug, code')
        .eq('is_active', true)
        .order('name');

      if (facultiesError) throw facultiesError;

      // Fetch all active departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('academic_departments')
        .select('id, name, slug, code, faculty_id')
        .eq('is_active', true)
        .order('name');

      if (departmentsError) throw departmentsError;

      // Fetch all active and visible courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('academic_courses')
        .select('id, name, slug, course_code, degree_level, department_id')
        .eq('is_active', true)
        .eq('is_visible_on_website', true)
        .order('name');

      if (coursesError) throw coursesError;

      // Build the hierarchy
      const hierarchy: AcademicNavFaculty[] = (facultiesData || []).map(faculty => {
        const facultyDepts = (departmentsData || [])
          .filter(d => d.faculty_id === faculty.id)
          .map(dept => {
            const deptCourses = (coursesData || []).filter(c => c.department_id === dept.id);
            
            return {
              id: dept.id,
              name: dept.name,
              slug: dept.slug || dept.code.toLowerCase(),
              code: dept.code,
              faculty_id: dept.faculty_id,
              coursesByLevel: {
                certificate: deptCourses.filter(c => c.degree_level === 'certificate'),
                undergraduate: deptCourses.filter(c => c.degree_level === 'undergraduate'),
                postgraduate: deptCourses.filter(c => c.degree_level === 'postgraduate'),
                doctoral: deptCourses.filter(c => c.degree_level === 'doctoral'),
              }
            };
          });

        return {
          id: faculty.id,
          name: faculty.name,
          slug: faculty.slug || faculty.code.toLowerCase(),
          code: faculty.code,
          departments: facultyDepts
        };
      });

      setFaculties(hierarchy);
    } catch (err: any) {
      console.error('Error fetching academic hierarchy:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { faculties, loading, error, refetch: fetchAcademicHierarchy };
}
