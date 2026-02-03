import { useState, useEffect, useCallback, useRef } from 'react';
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

// Simple in-memory cache
const cache: {
  data: AcademicNavFaculty[] | null;
  timestamp: number;
} = { data: null, timestamp: 0 };

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAcademicNavigation() {
  const [faculties, setFaculties] = useState<AcademicNavFaculty[]>(() => cache.data || []);
  const [loading, setLoading] = useState(!cache.data);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchAcademicHierarchy = useCallback(async (forceRefresh = false) => {
    // Use cache if valid and not forcing refresh
    const now = Date.now();
    if (!forceRefresh && cache.data && (now - cache.timestamp) < CACHE_DURATION) {
      setFaculties(cache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Single optimized query using Promise.all for parallel fetching
      const [facultiesResult, departmentsResult, coursesResult] = await Promise.all([
        supabase
          .from('academic_faculties')
          .select('id, name, slug, code')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('academic_departments')
          .select('id, name, slug, code, faculty_id')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('academic_courses')
          .select('id, name, slug, course_code, degree_level, department_id')
          .eq('is_active', true)
          .eq('is_visible_on_website', true)
      ]);

      if (facultiesResult.error) throw facultiesResult.error;
      if (departmentsResult.error) throw departmentsResult.error;
      if (coursesResult.error) throw coursesResult.error;

      const facultiesData = facultiesResult.data || [];
      const departmentsData = departmentsResult.data || [];
      const coursesData = coursesResult.data || [];

      // Create lookup maps for faster processing
      const coursesByDeptId = new Map<string, typeof coursesData>();
      for (const course of coursesData) {
        if (!course.department_id) continue;
        const existing = coursesByDeptId.get(course.department_id) || [];
        existing.push(course);
        coursesByDeptId.set(course.department_id, existing);
      }

      const deptsByFacultyId = new Map<string, typeof departmentsData>();
      for (const dept of departmentsData) {
        if (!dept.faculty_id) continue;
        const existing = deptsByFacultyId.get(dept.faculty_id) || [];
        existing.push(dept);
        deptsByFacultyId.set(dept.faculty_id, existing);
      }

      // Build the hierarchy using maps for O(1) lookups
      const hierarchy: AcademicNavFaculty[] = facultiesData.map(faculty => {
        const facultyDepts = deptsByFacultyId.get(faculty.id) || [];
        
        const departments: AcademicNavDepartment[] = facultyDepts.map(dept => {
          const deptCourses = coursesByDeptId.get(dept.id) || [];
          
          return {
            id: dept.id,
            name: dept.name,
            slug: dept.slug || dept.code.toLowerCase(),
            code: dept.code,
            faculty_id: dept.faculty_id!,
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
          departments
        };
      });

      // Update cache
      cache.data = hierarchy;
      cache.timestamp = now;

      setFaculties(hierarchy);
    } catch (err: any) {
      console.error('Error fetching academic hierarchy:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchAcademicHierarchy();
    }
  }, [fetchAcademicHierarchy]);

  const refetch = useCallback(() => fetchAcademicHierarchy(true), [fetchAcademicHierarchy]);

  return { faculties, loading, error, refetch };
}
