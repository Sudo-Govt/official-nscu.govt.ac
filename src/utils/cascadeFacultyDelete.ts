import { supabase } from '@/integrations/supabase/client';

/**
 * Cascading delete for a faculty - removes all related:
 * - Departments under the faculty
 * - Courses under those departments
 * - Subjects, Topics, Lessons under those courses
 * - CMS pages for faculty and departments
 * - Navigation menu entries
 */
export async function cascadeDeleteFaculty(facultyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get the faculty details first (for slug-based cleanup)
    const { data: faculty, error: facultyError } = await supabase
      .from('academic_faculties')
      .select('id, slug, name')
      .eq('id', facultyId)
      .single();

    if (facultyError || !faculty) {
      throw new Error('Faculty not found');
    }

    // 2. Get all departments under this faculty
    const { data: departments } = await supabase
      .from('academic_departments')
      .select('id, slug')
      .eq('faculty_id', facultyId);

    const departmentIds = departments?.map(d => d.id) || [];
    const departmentSlugs = departments?.map(d => d.slug).filter(Boolean) || [];

    // 3. Get all courses under these departments
    let courseIds: string[] = [];
    if (departmentIds.length > 0) {
      const { data: courses } = await supabase
        .from('academic_courses')
        .select('id')
        .in('department_id', departmentIds);
      courseIds = courses?.map(c => c.id) || [];
    }

    // 4. Delete in reverse order of dependency (bottom-up)
    
    // 4a. Delete lessons (via topics via subjects via courses)
    if (courseIds.length > 0) {
      // Get subject IDs
      const { data: subjects } = await supabase
        .from('academic_subjects')
        .select('id')
        .in('course_id', courseIds);
      const subjectIds = subjects?.map(s => s.id) || [];

      if (subjectIds.length > 0) {
        // Get topic IDs
        const { data: topics } = await supabase
          .from('academic_topics')
          .select('id')
          .in('subject_id', subjectIds);
        const topicIds = topics?.map(t => t.id) || [];

        // Delete lessons
        if (topicIds.length > 0) {
          await supabase.from('academic_lessons').delete().in('topic_id', topicIds);
        }

        // Delete topics
        await supabase.from('academic_topics').delete().in('subject_id', subjectIds);
      }

      // Delete subjects
      await supabase.from('academic_subjects').delete().in('course_id', courseIds);

      // Delete course_books relationships
      await supabase.from('course_books').delete().in('course_id', courseIds);

      // Delete courses
      await supabase.from('academic_courses').delete().in('department_id', departmentIds);
    }

    // 4b. Delete departments
    if (departmentIds.length > 0) {
      await supabase.from('academic_departments').delete().in('id', departmentIds);
    }

    // 5. Delete CMS pages related to faculty and departments
    const slugsToDelete = [faculty.slug, ...departmentSlugs].filter(Boolean);
    if (slugsToDelete.length > 0) {
      // Delete pages that match faculty or department slugs
      await supabase
        .from('cms_pages')
        .delete()
        .in('slug', slugsToDelete as string[]);
    }

    // 6. Delete navigation entries
    // First, find navigation items that link to faculty or department pages
    const hrefsToMatch = [
      `/academics/${faculty.slug}`,
      ...departmentSlugs.map(s => `/academics/${faculty.slug}/${s}`)
    ].filter(Boolean);

    if (hrefsToMatch.length > 0) {
      // Get all matching navigation items (including potential children)
      const { data: navItems } = await supabase
        .from('site_navigation')
        .select('id, parent_id')
        .or(hrefsToMatch.map(href => `href.eq.${href}`).join(','));

      if (navItems && navItems.length > 0) {
        const navIds = navItems.map(n => n.id);
        
        // Also find any children of these nav items
        const { data: childNavs } = await supabase
          .from('site_navigation')
          .select('id')
          .in('parent_id', navIds);

        const allNavIdsToDelete = [...navIds, ...(childNavs?.map(c => c.id) || [])];
        
        // Delete navigation entries
        await supabase.from('site_navigation').delete().in('id', allNavIdsToDelete);
      }
    }

    // 7. Finally, delete the faculty itself
    const { error: deleteError } = await supabase
      .from('academic_faculties')
      .delete()
      .eq('id', facultyId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error: any) {
    console.error('Cascade delete faculty error:', error);
    return { success: false, error: error.message || 'Failed to delete faculty' };
  }
}

/**
 * Cascade delete multiple faculties
 */
export async function cascadeDeleteFaculties(facultyIds: string[]): Promise<{ success: boolean; error?: string; deletedCount: number }> {
  let deletedCount = 0;
  
  for (const id of facultyIds) {
    const result = await cascadeDeleteFaculty(id);
    if (result.success) {
      deletedCount++;
    } else {
      return { success: false, error: result.error, deletedCount };
    }
  }
  
  return { success: true, deletedCount };
}
