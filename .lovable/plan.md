
# Comprehensive Dashboard Personalization and Course Consolidation Plan

## Executive Summary
This plan addresses the consolidation of duplicate course databases into a single source of truth, enhances personalization for student and alumni dashboards with full super admin control, and removes inappropriate features from the alumni section.

---

## Phase 1: Course Database Consolidation

### Current Issue
Two separate course tables exist:
- `courses` (11 entries) - Used for enrollments, featured programs, Fast Track
- `academic_courses` (391 entries) - Used for course catalog, AI content

### Solution
Migrate all functionality to use `academic_courses` as the single source of truth.

### Database Changes
1. Add missing columns to `academic_courses`:
   - `fee_structure` (JSONB) - for Fast Track and payment integration
   - `college`, `department` - map from faculty/department hierarchy
   - `degree_type` - ensure compatibility with existing code

2. Migrate data from `courses` to `academic_courses`:
   - Transfer fee structures, featured flags
   - Update foreign key references in `students` table

3. Update all components to query `academic_courses`:
   - `FeaturedPrograms.tsx`
   - `FastTrackAdmission.tsx`
   - `StudentDashboardV2.tsx`
   - `StudentDataManagement.tsx`

---

## Phase 2: Student Dashboard Personalization

### Current Issue
Student dashboard uses hardcoded mock data instead of database-driven personalization.

### Solution Architecture

```text
+------------------+     +------------------------+     +-------------------+
|  Super Admin     | --> | student_dashboard_data | --> | Student Dashboard |
|  (Management UI) |     |    (JSONB storage)     |     |   (Personalized)  |
+------------------+     +------------------------+     +-------------------+
         |
         v
+------------------+
| academic_courses |
| academic_subjects|
| library_books    |
+------------------+
```

### Database Enhancements
1. **Enhance `student_dashboard_data` table**:
   - Add `enrolled_course_id` (FK to academic_courses)
   - Add `enrolled_subjects` (array of subject IDs)
   - Add `assigned_library_books` (array of book IDs)
   - Add `progress_graph_data` (JSONB for growth tracking)
   - Add `custom_resources` (array of resource IDs)

2. **Create `student_progress` table**:
   - Track lesson completion per subject
   - Store assessment scores over time
   - Calculate progress percentages

### Admin Interface Updates (StudentDataManagement.tsx)
1. **Course Assignment**:
   - Dropdown to select from `academic_courses`
   - Auto-populate subjects based on course selection
   - Filter library books by subject relevance

2. **Personal Growth Graph**:
   - Data entry for GPA trends over semesters
   - Completion metrics visualization
   - Export data for reporting

3. **Resource Assignment**:
   - Select from `library_books` table
   - Assign specific resources to individual students
   - Visibility controls per resource

### Student Dashboard Updates
1. **My Courses Section**:
   - Fetch enrolled course from `academic_courses` via student's assignment
   - Display only subjects linked to their course
   - Show progress based on completed lessons

2. **Library Section**:
   - Display only books assigned by admin
   - Filter by subject/topic relevance

3. **Progress Graph**:
   - Render chart from `progress_graph_data`
   - Show semester-by-semester improvement

---

## Phase 3: Alumni Dashboard Overhaul

### Current Issues
1. Alumni can post jobs (should be admin-only)
2. Dashboard lacks personalization controls
3. Limited features compared to other dashboards
4. No admin control over what alumni can see/download

### Solution: Remove Job Posting from Alumni

**AlumniCareer.tsx Changes**:
- Remove "Post a Job" button and dialog
- Keep job viewing/application functionality
- Jobs will be managed exclusively via admin JobManagement

### New Features for Alumni Dashboard

1. **Alumni Dashboard Data Table** (new):
```sql
CREATE TABLE alumni_dashboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  graduation_info JSONB,
  career_history JSONB,
  achievements JSONB,
  assigned_resources UUID[],
  visible_sections TEXT[],
  custom_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

2. **New Alumni Dashboard Sections**:
   - **Career Timeline**: Professional milestones
   - **Achievements Showcase**: Awards, publications, patents
   - **Continuing Education**: Courses, certifications earned post-graduation
   - **Giving History**: Donation records (view-only)
   - **Event Participation**: Past and upcoming events
   - **Mentorship Stats**: Mentees, hours contributed
   - **Resource Library**: Admin-assigned documents, videos

3. **Alumni Management Admin Updates**:
   - Individual alumni data management (like StudentDataManagement)
   - Visibility controls for dashboard sections
   - Resource assignment per alumni
   - Credential management (issue, revoke, verify)

### Admin Controls for Alumni Downloads
1. **Create `alumni_downloadable_resources` table**:
   - Store downloadable files assigned to alumni
   - Track download history
   - Set expiry dates

2. **Update AlumniDocuments.tsx**:
   - Fetch only admin-approved documents
   - Hide credential download if not verified
   - Log all download activities

---

## Phase 4: Implementation Details

### Files to Create
1. `src/components/admin/AlumniDataManagement.tsx` - Individual alumni control
2. `supabase/migrations/xxx_consolidate_courses.sql` - Course consolidation
3. `supabase/migrations/xxx_alumni_dashboard_data.sql` - New alumni tables

### Files to Modify

| File | Changes |
|------|---------|
| `AlumniCareer.tsx` | Remove job posting, keep job viewing only |
| `AlumniDashboard.tsx` | Add new sections, connect to alumni_dashboard_data |
| `StudentDashboardV2.tsx` | Fetch from academic_courses, use personalized data |
| `StudentDataManagement.tsx` | Add course/subject/book assignment dropdowns |
| `FeaturedPrograms.tsx` | Query academic_courses instead of courses |
| `FastTrackAdmission.tsx` | Query academic_courses for fee structure |
| `SuperAdminDashboard.tsx` | Add Alumni Data Management tab |
| `AlumniManagement.tsx` | Add individual alumni management section |

### RLS Policies
1. Alumni can only read their own dashboard_data
2. Super admins can read/write all dashboard_data
3. Alumni resources filtered by user_id assignment

---

## Phase 5: Testing Checklist

- [ ] Verify all course references use academic_courses
- [ ] Test student dashboard shows only assigned courses/subjects
- [ ] Confirm alumni cannot post jobs
- [ ] Validate admin can control all alumni dashboard content
- [ ] Check download restrictions work correctly
- [ ] Test RLS policies prevent unauthorized access

---

## Technical Notes

### Course Consolidation Migration Strategy
1. Create mapping table between old course IDs and new academic_course IDs
2. Update foreign keys in dependent tables
3. Deprecate `courses` table (do not delete immediately)
4. Add compatibility views if needed

### Performance Considerations
- Index `student_dashboard_data.student_id`
- Index `alumni_dashboard_data.user_id`
- Use batch queries for admin management views

### Backward Compatibility
- Maintain existing API contracts
- Add fallback queries during transition period
- Log deprecated table accesses for monitoring
