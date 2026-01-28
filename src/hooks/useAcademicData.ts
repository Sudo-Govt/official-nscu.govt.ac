import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type {
  Department,
  Faculty,
  AcademicCourse,
  Subject,
  Topic,
  Lesson,
  LibraryBook,
  CourseBook,
  AcademicStudent,
  StudentProgress,
  CourseWithHierarchy,
} from '@/types/academic';

// Faculty is now the top-level entity (no parent)
export function useFaculties() {
  const [data, setData] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('academic_faculties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as Faculty[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch faculties', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const create = useCallback(async (item: Partial<Faculty>) => {
    const { data: result, error } = await supabase.from('academic_faculties').insert([item as any]).select().single();
    if (error) throw error;
    setData(prev => [result as Faculty, ...prev]);
    toast({ title: 'Success', description: 'Created successfully' });
    return result as Faculty;
  }, [toast]);

  const update = useCallback(async (id: string, updates: Partial<Faculty>) => {
    const { data: result, error } = await supabase.from('academic_faculties').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setData(prev => prev.map(item => item.id === id ? result as Faculty : item));
    toast({ title: 'Success', description: 'Updated successfully' });
    return result as Faculty;
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('academic_faculties').delete().eq('id', id);
    if (error) throw error;
    setData(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Success', description: 'Deleted successfully' });
  }, [toast]);

  return { data, loading, fetch, create, update, remove, setData };
}

// Department now belongs to Faculty
export function useDepartments() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('academic_departments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as Department[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch departments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchWithFaculty = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('academic_departments')
        .select('*, faculty:academic_faculties(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as Department[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const create = useCallback(async (item: Partial<Department>) => {
    const { data: result, error } = await supabase.from('academic_departments').insert([item as any]).select().single();
    if (error) throw error;
    setData(prev => [result as Department, ...prev]);
    toast({ title: 'Success', description: 'Created successfully' });
    return result as Department;
  }, [toast]);

  const update = useCallback(async (id: string, updates: Partial<Department>) => {
    const { data: result, error } = await supabase.from('academic_departments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setData(prev => prev.map(item => item.id === id ? result as Department : item));
    toast({ title: 'Success', description: 'Updated successfully' });
    return result as Department;
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('academic_departments').delete().eq('id', id);
    if (error) throw error;
    setData(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Success', description: 'Deleted successfully' });
  }, [toast]);

  return { data, loading, fetch, fetchWithFaculty, create, update, remove, setData };
}

// Courses now belong to Department
export function useAcademicCourses() {
  const [data, setData] = useState<AcademicCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.from('academic_courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setData((result as unknown as AcademicCourse[]) || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch courses with full hierarchy: Course -> Department -> Faculty
  const fetchWithHierarchy = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('academic_courses')
        .select('*, department:academic_departments(*, faculty:academic_faculties(*))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as AcademicCourse[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const create = useCallback(async (item: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('academic_courses').insert([item as any]).select().single();
    if (error) throw error;
    setData(prev => [(result as unknown as AcademicCourse), ...prev]);
    toast({ title: 'Success', description: 'Created successfully' });
    return result as unknown as AcademicCourse;
  }, [toast]);

  const update = useCallback(async (id: string, updates: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('academic_courses').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setData(prev => prev.map(item => item.id === id ? (result as unknown as AcademicCourse) : item));
    toast({ title: 'Success', description: 'Updated successfully' });
    return result as unknown as AcademicCourse;
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('academic_courses').delete().eq('id', id);
    if (error) throw error;
    setData(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Success', description: 'Deleted successfully' });
  }, [toast]);

  return { data, loading, fetch, fetchWithHierarchy, create, update, remove, setData };
}

export function useLibraryBooks() {
  const [data, setData] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.from('library_books').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as LibraryBook[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const create = useCallback(async (item: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('library_books').insert([item as any]).select().single();
    if (error) throw error;
    setData(prev => [result as LibraryBook, ...prev]);
    toast({ title: 'Success', description: 'Created successfully' });
    return result as LibraryBook;
  }, [toast]);

  const update = useCallback(async (id: string, updates: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('library_books').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setData(prev => prev.map(item => item.id === id ? result as LibraryBook : item));
    toast({ title: 'Success', description: 'Updated successfully' });
    return result as LibraryBook;
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('library_books').delete().eq('id', id);
    if (error) throw error;
    setData(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Success', description: 'Deleted successfully' });
  }, [toast]);

  return { data, loading, fetch, create, update, remove, setData };
}

export function useAcademicStudents() {
  const [data, setData] = useState<AcademicStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.from('academic_students').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as AcademicStudent[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchWithCourse = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('academic_students')
        .select('*, course:academic_courses(*, department:academic_departments(*, faculty:academic_faculties(*)))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as AcademicStudent[] || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const create = useCallback(async (item: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('academic_students').insert([item as any]).select().single();
    if (error) throw error;
    setData(prev => [result as AcademicStudent, ...prev]);
    toast({ title: 'Success', description: 'Created successfully' });
    return result as AcademicStudent;
  }, [toast]);

  const update = useCallback(async (id: string, updates: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('academic_students').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setData(prev => prev.map(item => item.id === id ? result as AcademicStudent : item));
    toast({ title: 'Success', description: 'Updated successfully' });
    return result as AcademicStudent;
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('academic_students').delete().eq('id', id);
    if (error) throw error;
    setData(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Success', description: 'Deleted successfully' });
  }, [toast]);

  return { data, loading, fetch, fetchWithCourse, create, update, remove, setData };
}

// Fetch full course with all hierarchy (new: Course -> Department -> Faculty)
export async function fetchCourseWithHierarchy(courseIdOrSlug: string): Promise<CourseWithHierarchy | null> {
  try {
    let query = supabase
      .from('academic_courses')
      .select('*, department:academic_departments(*, faculty:academic_faculties(*))');
    
    if (courseIdOrSlug.includes('-')) {
      query = query.eq('slug', courseIdOrSlug);
    } else {
      query = query.eq('id', courseIdOrSlug);
    }

    const { data: course, error: courseError } = await query.single();
    if (courseError) throw courseError;

    const { data: subjects } = await supabase.from('academic_subjects').select('*').eq('course_id', course.id).eq('is_active', true).order('order_index');
    const subjectIds = subjects?.map(s => s.id) || [];
    
    const { data: topics } = await supabase.from('academic_topics').select('*').in('subject_id', subjectIds.length ? subjectIds : ['']).eq('is_active', true).order('order_index');
    const topicIds = topics?.map(t => t.id) || [];
    
    const { data: lessons } = await supabase.from('academic_lessons').select('*').in('topic_id', topicIds.length ? topicIds : ['']).eq('is_active', true).order('order_index');
    const { data: books } = await supabase.from('course_books').select('*, book:library_books(*)').eq('course_id', course.id);

    const topicsWithLessons = (topics || []).map(topic => ({ ...topic, lessons: (lessons || []).filter(l => l.topic_id === topic.id) }));
    const subjectsWithTopics = (subjects || []).map(subject => ({ ...subject, topics: topicsWithLessons.filter(t => t.subject_id === subject.id) }));

    return { ...course, subjects: subjectsWithTopics, books: books || [] } as CourseWithHierarchy;
  } catch (error) {
    console.error('Error fetching course hierarchy:', error);
    return null;
  }
}

export function calculateProgress(course: AcademicCourse, completedLessons: number, totalLessons: number) {
  const completionProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  let timeProgress = 0;
  if (course.start_date && course.end_date) {
    const start = new Date(course.start_date).getTime();
    const end = new Date(course.end_date).getTime();
    const now = Date.now();
    if (now >= end) timeProgress = 100;
    else if (now > start) timeProgress = Math.round(((now - start) / (end - start)) * 100);
  }
  return { completionProgress, timeProgress, overallProgress: Math.round((completionProgress + timeProgress) / 2) };
}
