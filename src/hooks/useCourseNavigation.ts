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
        const { data, error } = await supabase
          .from('courses')
          .select('course_name, degree_type, slug')
          .eq('is_active', true)
          .eq('featured', true)
          .order('course_name')
          .limit(8);

        if (error) throw error;

        const courses = (data || [])
          .filter(course => course.slug)
          .map(course => ({
            title: `${course.degree_type} in ${course.course_name}`,
            href: `/programs/${course.slug}`,
            degree_type: course.degree_type
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
