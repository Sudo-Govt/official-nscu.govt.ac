import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CourseNavItem {
  title: string;
  href: string;
  degree_type: string;
}

interface CourseNavigationData {
  featuredCourses: CourseNavItem[];
  loading: boolean;
}

export const useCourseNavigation = (): CourseNavigationData => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseNavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Query from academic_courses (consolidated source of truth)
        const { data, error } = await supabase
          .from('academic_courses')
          .select('name, degree_type, slug')
          .eq('is_active', true)
          .eq('featured', true)
          .order('name')
          .limit(8);

        if (error) throw error;

        const courses = (data || [])
          .filter(course => course.slug)
          .map(course => ({
            title: `${course.degree_type || 'Degree'} in ${course.name}`,
            href: `/programs/${course.slug}`,
            degree_type: course.degree_type || 'Degree'
          }));

        setFeaturedCourses(courses);
      } catch (error) {
        console.error('Error fetching course navigation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { featuredCourses, loading };
};
