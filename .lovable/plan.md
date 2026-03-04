

# Plan: Create Accelerated Degree Programs Page with SEO Keywords

## 1. New Page Component
**File:** `src/pages/academics/AcceleratedDegreePrograms.tsx`
- Uses `PageLayout` component (same design as all other academic pages)
- Full content from the provided text, organized into card-based sections with icons
- `useSEO` hook with all the hidden SEO keywords embedded in the `keywords` meta tag
- Hidden SEO keywords placed in a visually hidden `<div>` (using `sr-only` class) at the bottom of the page for crawlers
- Structured data via `generateWebPageSchema` and `generateBreadcrumbSchema`
- CTA button at bottom linking to `/fast-track-admission`

### SEO Keywords (meta + hidden text):
```
fast track degree, one year degree program, degree completion program, 
online bachelor degree fast, distance degree for working professionals, 
work experience degree program, credit transfer bachelor degree, 
accelerated bachelor degree, executive bachelor degree program
```

## 2. Route Registration
**File:** `src/App.tsx`
- Import `AcceleratedDegreePrograms` alongside other academic imports (line ~44)
- Add route `<Route path="/academics/accelerated-degree-programs" element={<AcceleratedDegreePrograms />} />` in the academic routes block (after line 256)

## 3. Content Sections
The page will have these sections, each in a styled card:
1. Hero intro paragraph
2. Fast Track Degree Programs
3. One Year Degree Completion Pathway
4. Distance Degree Programs
5. Work Experience Degree Programs
6. Credit Transfer Bachelor Degree
7. Accelerated Bachelor Degree Structure
8. Executive Bachelor Degree Program
9. Why Choose NSCU
10. CTA section

No design changes, no database changes, no navigation code changes.

