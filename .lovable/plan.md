
# AI Content Generator Enhancement & Mega Uploader Optimization Plan

## Overview

This plan addresses two distinct improvements:
1. **Mega Course Uploader Performance** - Optimizing the upload process which is slow due to sequential database operations
2. **AI Content Generator Enhancement** - Implementing a comprehensive 7-layer framework for generating detailed, ABET-compliant academic curricula

---

## Issue 1: Mega Course Uploader Performance

### Current Problem
The MegaCourseUploader processes each row sequentially with individual database queries:
- Each faculty, department, and course triggers separate insert/check queries
- Navigation items and CMS pages are created one at a time
- For a file with 100 courses, this could mean 500+ sequential database round-trips

### Solution: Batch Processing Architecture

**1.1 Batch Insert Operations**
- Replace individual inserts with bulk upserts using `INSERT ... ON CONFLICT`
- Process all unique faculties in a single batch query
- Process all unique departments in a single batch query
- Process all courses in batched chunks (50 at a time)

**1.2 Parallel Processing**
- Use `Promise.all()` for independent operations
- Create navigation items and CMS pages in parallel batches
- Reduce total API calls by ~80%

**1.3 Progress Optimization**
- Pre-calculate totals before starting
- Update progress in larger increments
- Provide more accurate time estimates

---

## Issue 2: AI Content Generator - 7-Layer Framework

### Current State
The existing `generate-course-content` edge function uses a simple prompt that produces generic content without structured semester details, books, or assessment methods.

### New Architecture: 7-Layer Framework

The new system will generate comprehensive curricula through a multi-pass approach:

**Layer 1: Master Context**
Global parameters including faculty, department, course details, degree type, duration, credits, and institution type.

**Layer 2: Structural Skeleton**
Pre-generation validation of:
- Number of semesters and credits per semester
- Subjects per semester (5-7)
- Core:Elective ratio
- Assessment weight distribution
- Topics per subject (5)
- Sub-topics per topic (4)
- Books per subject (5)

**Layer 3: Semester & Subject Generation**
Thematic progression across years:
- Year 1: Foundations (introductory, interdisciplinary)
- Year 2: Analysis & Specialization (theory, research methods)
- Year 3+: Advanced & Capstone (independent research, dissertation)

Each subject includes: code, name, credits, contact hours, Core/Elective tag, description, prerequisites.

**Layer 4: Topic & Sub-Topic Drill-Down**
For each subject:
- 5 major topics
- 4 sub-topics per topic (specific, teachable concepts)
- Logical progression: define, explain, apply, analyze

**Layer 5: Books & Study Materials**
Per subject (5 materials):
- 1 Primary Textbook
- 1-2 Primary Source texts
- 1 Supplementary text
- 1 Reference/Online Resource
With: Title, Author, Year, Type, Usage notes

**Layer 6: Assessment Structure**
Standardized assessment weights:
- Mid-Term: 20-25%
- Final Exam: 25-35%
- Research Paper: 20-35%
- Presentation: 10-15%
- Participation: 10-15%
- Special rules for dissertations, labs

**Layer 7: Validation**
Quality gate checking:
- Total credits match
- 20 teachable units per subject (5x4)
- 5 books per subject
- Assessment = 100%
- Logical prerequisites
- Dissertation in final year only

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/generate-curriculum-v2/index.ts` | New comprehensive AI curriculum generator with 7-layer prompts |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/academic/MegaCourseUploader.tsx` | Add batch processing, parallel operations, chunked inserts |
| `src/components/admin/academic/CourseContentGenerator.tsx` | Update UI to handle new comprehensive output, add semester tabs, subject accordions |
| `supabase/functions/generate-course-content/index.ts` | Replace with 7-layer prompt framework |
| `src/components/admin/academic/ABETCourseGenerator.tsx` | Integrate with new generator, enhance result display |

---

## New Edge Function: generate-curriculum-v2

### Input Parameters
```json
{
  "facultyName": "Faculty of Engineering",
  "facultyCode": "ENG",
  "departmentName": "Computer Science",
  "departmentCode": "CS",
  "courseName": "Bachelor of Computer Science",
  "courseCode": "BCS",
  "degreeType": "BS",
  "durationSemesters": 8,
  "totalCredits": 160,
  "institutionType": "Research University",
  "specialization": "Artificial Intelligence"
}
```

### Output Structure
```json
{
  "skeleton": {
    "semesterCount": 8,
    "creditsPerSemester": 20,
    "subjectsPerSemester": 6,
    "coreElectiveRatio": "70:30",
    "assessmentTemplate": {...},
    "topicsPerSubject": 5,
    "subTopicsPerTopic": 4,
    "booksPerSubject": 5
  },
  "semesters": [
    {
      "number": 1,
      "theme": "Foundations",
      "totalCredits": 20,
      "subjects": [
        {
          "code": "CS-101",
          "name": "Introduction to Programming",
          "credits": 4,
          "contactHours": 60,
          "type": "Core",
          "description": "...",
          "prerequisites": [],
          "topics": [
            {
              "title": "Programming Paradigms",
              "subTopics": [
                "Imperative programming: Definition and characteristics",
                "Object-oriented programming: Encapsulation principles",
                "Functional programming: Pure functions and immutability",
                "Comparison: Selecting paradigms for problem domains"
              ]
            }
          ],
          "books": [
            {
              "title": "Structure and Interpretation of Computer Programs",
              "author": "Harold Abelson, Gerald Jay Sussman",
              "year": 1996,
              "type": "Primary Textbook",
              "usage": "Compulsory Chapters 1-3"
            }
          ],
          "assessment": {
            "midTerm": 25,
            "final": 30,
            "assignments": 20,
            "project": 15,
            "participation": 10
          },
          "learningOutcomes": ["CLO1", "CLO2"]
        }
      ]
    }
  ],
  "gradingSystem": {...},
  "careerOutcomes": {...},
  "eligibility": {...},
  "validation": {
    "totalCreditsValid": true,
    "subjectStructureValid": true,
    "assessmentValid": true,
    "errors": []
  }
}
```

---

## Mega Uploader Optimization Strategy

### Current Flow (Slow)
```
For each row:
  1. Check if faculty exists (query)
  2. If not, insert faculty (query)
  3. Check if department exists (query)
  4. If not, insert department (query)
  5. Insert course (query)
  6. Create navigation (query)
  7. Create CMS page (query)
```

### Optimized Flow (Fast)
```
Phase 1: Parse & Deduplicate
  - Parse entire file
  - Extract unique faculties, departments
  - Build relationship maps

Phase 2: Batch Faculty Upsert
  - Single query: INSERT all faculties ON CONFLICT DO NOTHING
  - Single query: SELECT all faculties to get IDs

Phase 3: Batch Department Upsert
  - Single query: INSERT all departments ON CONFLICT DO NOTHING
  - Single query: SELECT all departments to get IDs

Phase 4: Batch Course Insert (chunks of 50)
  - Parallel: INSERT courses in chunks
  - Parallel: Create navigation entries
  - Parallel: Create CMS pages

Phase 5: Report Results
```

### Expected Performance Improvement
- Current: ~3-5 seconds per row
- Optimized: ~50ms per row (60x improvement)
- 100 courses: from ~5 minutes to ~5 seconds

---

## UI Enhancements for Course Content Generator

### New Features
1. **Skeleton Preview** - Show structural skeleton before full generation
2. **Semester Tabs** - Navigate between semesters easily
3. **Subject Accordions** - Expandable views for each subject with topics, sub-topics, books
4. **Assessment Matrix** - Visual display of assessment weights
5. **Validation Report** - Show Layer 7 validation results with any errors
6. **Export Options** - Download as PDF syllabus or Excel curriculum map

### Preview Section Layout
```
[Semester 1: Foundations] [Semester 2] [Semester 3] ...
┌────────────────────────────────────────────────────────┐
│ Total Credits: 20 | 6 Subjects | Theme: Foundations    │
├────────────────────────────────────────────────────────┤
│ ▼ CS-101 Introduction to Programming (4 cr) [Core]    │
│   ├── Description: ...                                 │
│   ├── Topics:                                          │
│   │   ├── Topic 1: Programming Paradigms               │
│   │   │   ├── Imperative programming...                │
│   │   │   ├── Object-oriented programming...           │
│   │   │   ├── Functional programming...                │
│   │   │   └── Comparison: Selecting paradigms...       │
│   │   └── Topic 2: ...                                 │
│   ├── Books (5):                                       │
│   │   ├── [Primary] SICP - Abelson (Ch.1-3)           │
│   │   ├── [Source] Clean Code - R. Martin             │
│   │   └── ...                                          │
│   └── Assessment: Mid 25% | Final 30% | Project 15%   │
│                                                        │
│ ▼ MATH-101 Calculus I (4 cr) [Core]                   │
│   └── ...                                              │
└────────────────────────────────────────────────────────┘
```

---

## Implementation Order

1. **Create new edge function** `generate-curriculum-v2` with 7-layer prompts
2. **Update MegaCourseUploader** with batch processing
3. **Update CourseContentGenerator UI** for new data structure
4. **Update ABETCourseGenerator** to use new edge function
5. **Test end-to-end** with sample curricula
6. **Migrate from Lovable AI Gateway** instead of OpenAI for cost efficiency (uses LOVABLE_API_KEY which is already configured)

---

## API Model Selection

The current implementation uses OpenAI's `gpt-4o`. Since Lovable AI Gateway is available with pre-configured credentials, the new edge function will use:
- **Model**: `google/gemini-3-flash-preview` (fast, capable, no API key needed from user)
- **Fallback**: `google/gemini-2.5-pro` for complex curricula if needed

This provides:
- Faster generation
- No additional API key configuration
- Rate limit handling built-in
