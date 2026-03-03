import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NavItem {
  id: string;
  parent_id: string | null;
  title: string;
  href: string | null;
  position: number;
  is_active: boolean;
  menu_location: string;
  icon: string | null;
}

interface FeaturedCourse {
  title: string;
  href: string;
}

interface CachedNavData {
  navItems: NavItem[];
  featuredCourses: FeaturedCourse[];
  timestamp: number;
}

const CACHE_KEY = 'nscu_nav_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function loadCache(): CachedNavData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedNavData;
  } catch {
    return null;
  }
}

function saveCache(data: CachedNavData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable – silently ignore
  }
}

export function useResilientNavigation() {
  const cached = useRef(loadCache());

  const [navItems, setNavItems] = useState<NavItem[]>(cached.current?.navItems ?? []);
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>(cached.current?.featuredCourses ?? []);
  const [isFromCache, setIsFromCache] = useState(!!cached.current);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const [navResult, coursesResult] = await Promise.all([
        supabase
          .from('site_navigation')
          .select('*')
          .eq('is_active', true)
          .eq('menu_location', 'main')
          .order('position'),
        supabase
          .from('courses')
          .select('course_name, degree_type, slug')
          .eq('is_active', true)
          .eq('featured', true)
          .order('course_name')
          .limit(6),
      ]);

      // If both fail, keep cached data
      if (navResult.error && coursesResult.error) {
        console.warn('Navigation fetch failed, using cached data');
        setIsFromCache(true);
        return;
      }

      const freshNav = navResult.data && navResult.data.length > 0 ? navResult.data : (cached.current?.navItems ?? []);
      const freshCourses: FeaturedCourse[] = coursesResult.data
        ? coursesResult.data
            .filter((c: any) => c.slug)
            .map((c: any) => ({
              title: `${c.degree_type} in ${c.course_name}`,
              href: `/programs/${c.slug}`,
            }))
        : (cached.current?.featuredCourses ?? []);

      setNavItems(freshNav);
      setFeaturedCourses(freshCourses);
      setIsFromCache(false);

      // Persist to localStorage
      const cachePayload: CachedNavData = {
        navItems: freshNav,
        featuredCourses: freshCourses,
        timestamp: Date.now(),
      };
      saveCache(cachePayload);
      cached.current = cachePayload;
    } catch (err) {
      console.warn('Navigation fetch threw, using cached data', err);
      setIsFromCache(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchAll();
    }
  }, [fetchAll]);

  return { navItems, featuredCourses, isFromCache, loading, refetch: fetchAll };
}

