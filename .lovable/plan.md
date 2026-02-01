
# Academic Navigation & Hierarchy Restructuring Plan

## Overview

This plan restructures the academic navigation system to create a dynamic, database-driven multi-level menu that follows the hierarchy: **Faculty > Department > Course**. The navigation will use hover/click interactions, with faculties appearing as sub-menu items under "Academics", departments nested under faculties, and courses nested under departments.

## Current State Analysis

### Existing Infrastructure
- **Database Tables**: `academic_faculties`, `academic_departments`, `academic_courses`, `academic_subjects`
- **Navigation**: `site_navigation` table with parent-child relationships
- **Static Pages**: 15 hardcoded pages under `/academics/` (SchoolArts.tsx, SchoolBusiness.tsx, etc.)
- **AI Course Generator**: Already generates semester structure, subjects, and reference materials
- **Course Detail Page**: `/courses/:slug` displays curriculum using accordion layout

### Key Issues to Address
1. Static academic pages need to be replaced with dynamic database-driven pages
2. AI-generated courses lack detailed semester information (books, credits per subject per semester)
3. Navigation menu doesn't properly nest departments and courses under faculties
4. Missing intermediate pages for course type filtering (UG, PG, PhD, Certificate)

---

## Implementation Plan

### Phase 1: Database Schema Enhancements

**1.1 Enhance `academic_courses` table**

Add columns to support degree categorization and richer semester data:
- `degree_level` (enum): 'certificate', 'undergraduate', 'postgraduate', 'doctoral'
- `admission_info` (JSONB): Store application dates, fees, requirements
- `semester_details` (JSONB): Enhanced semester-wise breakdown with books and credits

**1.2 Enhance `academic_subjects` table**

Add columns for detailed per-subject data:
- `syllabus_units` (JSONB): Detailed unit breakdown with hours
- `reference_books` (JSONB): Array of book references per subject
- `learning_outcomes` (TEXT[]): Course learning outcomes
- `assessment_methods` (JSONB): Internal/external assessment breakdown

**1.3 Enhance `academic_faculties` and `academic_departments` tables**

Add CMS-like content fields:
- `hero_image_url` (TEXT)
- `long_description` (TEXT)
- `statistics` (JSONB): Students, programs, research funding, etc.
- `research_centers` (JSONB)
- `special_programs` (JSONB)
- `alumni_highlights` (JSONB)
- `slug` (TEXT): URL-friendly identifier

---

### Phase 2: Dynamic Page Components

**2.1 Create Dynamic Faculty Page (`/faculty/:slug`)**

A rich faculty page similar to current SchoolArts.tsx but database-driven:
- Hero section with statistics (students, departments, programs, funding)
- Overview/About section
- Academic Departments grid (clickable cards linking to department pages)
- Research Centers section
- Special Programs section
- Academic & Alumni Excellence sections

**2.2 Create Dynamic Department Page (`/department/:slug`)**

Shows department details with course listings by degree level:
- Department overview with faculty link breadcrumb
- Tabs or sections for: Certificate | Undergraduate | Postgraduate | Doctoral
- Each section shows course cards for that degree level
- Clicking a degree tab/section shows list of courses

**2.3 Create Degree Type Listing Page (`/department/:slug/:degreeType`)**

When clicking "Undergraduate" under a department:
- Shows all UG courses in that department
- Card layout with course name, code, duration, credits
- Link to full course detail page

**2.4 Enhance Course Detail Page (`/courses/:slug`)**

Update to show comprehensive semester details:
- Program Overview card
- Admission Information card (dates, fees, requirements)
- Semester-by-semester tabs with:
  - Subject cards showing credits, type (Core/Elective/Lab)
  - Expandable syllabus units per subject
  - Reference books per subject
  - Learning outcomes
  - Assessment breakdown
- Reading Materials section
- Career Outcomes section

---

### Phase 3: Navigation Menu Enhancement

**3.1 Update Header.tsx Navigation Logic**

Modify the navigation building logic to:
1. Fetch faculties from `academic_faculties` table
2. For each faculty, fetch its departments
3. For each department, fetch its courses grouped by degree_level
4. Build a nested menu structure:

```
Academics (hover to expand)
├── PhD Programs
├── Course Catalog
├── Academic Calendar
├── Faculty of Engineering (hover to expand)
│   ├── Department of Computer Science (hover to expand)
│   │   ├── Certificate Programs
│   │   ├── Undergraduate Programs
│   │   ├── Postgraduate Programs
│   │   └── Doctoral Programs
│   ├── Department of Electrical Engineering
│   └── ...
├── Faculty of Arts and Humanities
└── ...
```

**3.2 Multi-Level Dropdown Component**

Create a new navigation component that supports 4 levels of nesting:
- Level 1: Academics (top-level menu item)
- Level 2: Faculties (shown on hover/click of Academics)
- Level 3: Departments (shown on hover of a Faculty)
- Level 4: Course categories/courses (shown on hover of a Department)

**3.3 Auto-Sync Navigation with Database**

Enhance the existing sync logic in:
- `FacultyManagement.tsx` - When creating/updating a faculty, auto-create navigation entry
- `DepartmentManagement.tsx` - When creating/updating a department, nest under faculty
- `AcademicCourseManagement.tsx` - When creating a course, update department's course count

---

### Phase 4: AI Course Generator Enhancement

**4.1 Update `generate-abet-course` Edge Function**

Enhance the prompt to request:
- Detailed semester breakdown with credit distribution
- Per-subject reference books (title, author, ISBN, publisher)
- Per-subject syllabus units with lecture hours
- Complete learning outcomes mapped to assessment methods
- Eligibility criteria and admission information

**4.2 Update AI Response Processing**

When adding an AI-generated course to the system:
- Store semester_details in the new JSONB column
- Create `academic_subjects` with full syllabus_units and reference_books
- Create `library_books` entries for new books
- Link books to course via `course_books` table

---

### Phase 5: Remove Static Pages

**5.1 Deprecate Static Academic Pages**

Remove or redirect these static pages to dynamic routes:
- `/academics/school-arts` → `/faculty/school-of-arts`
- `/academics/school-science` → `/faculty/school-of-science`
- `/academics/college-engineering` → `/faculty/college-of-engineering`
- (All 15 static academic pages)

**5.2 Update App.tsx Routes**

Replace static route imports with dynamic route handlers:
```tsx
<Route path="/faculty/:slug" element={<DynamicFacultyPage />} />
<Route path="/department/:slug" element={<DynamicDepartmentPage />} />
<Route path="/department/:slug/:degreeType" element={<DegreeCourseListing />} />
<Route path="/courses/:slug" element={<CourseDetailPage />} /> (keep existing)
```

---

### Phase 6: Admin Panel Updates

**6.1 Enhance Faculty Management**

Add fields for:
- Hero image upload
- Long description (rich text)
- Statistics editor (key-value pairs)
- Research centers manager
- Special programs manager
- Alumni highlights

**6.2 Enhance Department Management**

Add fields for:
- Department overview/description
- Link to faculty (already exists)
- Hero image

**6.3 Enhance Course Management**

Add/improve:
- Degree level dropdown (Certificate/UG/PG/Doctoral)
- Admission info editor
- Semester details viewer/editor (view AI-generated data)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/faculty/DynamicFacultyPage.tsx` | Database-driven faculty page |
| `src/pages/department/DynamicDepartmentPage.tsx` | Database-driven department page |
| `src/pages/department/DegreeCourseListing.tsx` | Course listing by degree type |
| `src/components/navigation/AcademicMegaMenu.tsx` | Multi-level academic navigation |
| `src/hooks/useAcademicNavigation.ts` | Hook to fetch navigation hierarchy |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/Header.tsx` | Integrate new academic mega menu |
| `src/pages/courses/CourseDetailPage.tsx` | Add semester tabs with detailed subject info |
| `src/components/admin/academic/FacultyManagement.tsx` | Add new CMS fields |
| `src/components/admin/academic/DepartmentManagement.tsx` | Add description fields |
| `src/components/admin/academic/AcademicCourseManagement.tsx` | Add degree level selector |
| `supabase/functions/generate-abet-course/index.ts` | Enhance prompt for semester details |
| `src/App.tsx` | Add new dynamic routes, remove static imports |
| `src/types/academic.ts` | Add new interfaces for enhanced data |

## Files to Remove/Deprecate

All static academic pages under `src/pages/academics/`:
- SchoolArts.tsx, SchoolBusiness.tsx, SchoolLaw.tsx, etc. (15 files)

---

## Technical Details

### Navigation Data Flow

```text
academic_faculties (database)
       ↓
  useAcademicNavigation hook
       ↓
  AcademicMegaMenu component
       ↓
  Header.tsx (replaces current Academics submenu)
```

### Course Detail Page Semester Structure

```text
┌─────────────────────────────────────────────┐
│ Course: Bachelor of Computer Science        │
├─────────────────────────────────────────────┤
│ [Sem 1] [Sem 2] [Sem 3] [Sem 4] [Sem 5]... │
├─────────────────────────────────────────────┤
│ Semester 1 - 22 Credits                     │
│                                             │
│ ▼ CS101 - Programming Fundamentals (4 cr)  │
│   ├── Description: ...                      │
│   ├── Units:                                │
│   │   └── Unit 1: Introduction (10 hrs)     │
│   │   └── Unit 2: Control Structures (12h)  │
│   ├── Reference Books:                      │
│   │   └── "C Programming" by K&R            │
│   ├── Learning Outcomes: CLO1, CLO2         │
│   └── Assessment: 40% Internal, 60% External│
│                                             │
│ ▼ MATH101 - Calculus I (4 cr)              │
│   └── ...                                   │
└─────────────────────────────────────────────┘
```

### Database Migration Summary

```sql
-- Enhance academic_faculties
ALTER TABLE academic_faculties ADD COLUMN IF NOT EXISTS 
  slug TEXT,
  hero_image_url TEXT,
  long_description TEXT,
  statistics JSONB DEFAULT '{}',
  research_centers JSONB DEFAULT '[]',
  special_programs JSONB DEFAULT '[]',
  alumni_highlights JSONB DEFAULT '[]';

-- Enhance academic_departments
ALTER TABLE academic_departments ADD COLUMN IF NOT EXISTS 
  slug TEXT,
  hero_image_url TEXT,
  long_description TEXT;

-- Enhance academic_courses
ALTER TABLE academic_courses ADD COLUMN IF NOT EXISTS 
  degree_level TEXT DEFAULT 'undergraduate',
  admission_info JSONB DEFAULT '{}',
  semester_details JSONB DEFAULT '[]';

-- Enhance academic_subjects
ALTER TABLE academic_subjects ADD COLUMN IF NOT EXISTS 
  syllabus_units JSONB DEFAULT '[]',
  reference_books JSONB DEFAULT '[]',
  learning_outcomes TEXT[],
  assessment_methods JSONB DEFAULT '{}';
```

---

## Expected Outcome

After implementation:
1. Hovering over "Academics" shows all faculties
2. Hovering over a faculty shows its departments
3. Hovering over a department shows course categories (UG, PG, etc.)
4. Clicking any item navigates to the appropriate dynamic page
5. All pages are populated from the database
6. AI-generated courses include complete semester details with books and credits
7. Admin can manage all content centrally from the Super Admin dashboard
8. No more static hardcoded academic pages
