
# NSCU Project -- Full Audit and Development Summary

---

## 1. PROJECT OVERVIEW

NSCU is a large-scale **university management platform** with:
- **200+ pages** (public site, dashboards, admin panels)
- **12,001 academic courses** in the database (78 have AI-generated curriculum content)
- **86 database tables** covering academics, alumni, CMS, email, jobs, admissions, and more
- **20 Edge Functions** for backend logic (user management, email, AI generation, payments)
- **4 user profiles** currently registered
- Role-based dashboards for Students, Faculty, Alumni, Agents, Admins, Super Admins, and more

---

## 2. ORPHAN PAGES (16 files with NO route in App.tsx)

These pages exist in `src/pages/` but are **completely inaccessible** -- no route points to them:

| # | File | Missing Route |
|---|------|---------------|
| 1 | `departments/BusinessAdministration.tsx` | `/departments/business-administration` |
| 2 | `departments/Engineering.tsx` | `/departments/engineering` |
| 3 | `departments/HealthSciences.tsx` | `/departments/health-sciences` |
| 4 | `departments/LiberalArts.tsx` | `/departments/liberal-arts` |
| 5 | `alumni/AlumniDirectory.tsx` | `/alumni/directory` |
| 6 | `campus-life/FitnessCenters.tsx` | `/campus-life/fitness-centers` |
| 7 | `events/Calendar.tsx` | `/events/calendar` |
| 8 | `portal/Canvas.tsx` | `/portal/canvas` |
| 9 | `portal/FacultyEmail.tsx` | `/portal/faculty-email` |
| 10 | `portal/StudentEmail.tsx` | `/portal/student-email` |
| 11 | `services/InternationalServices.tsx` | `/services/international` |
| 12 | `services/MulticulturalAffairs.tsx` | `/services/multicultural-affairs` |
| 13 | `services/VeteransServices.tsx` | `/services/veterans` |
| 14 | `resources/CampusSafety.tsx` | `/resources/campus-safety` |
| 15 | `resources/EmergencyInfo.tsx` | `/resources/emergency-info` |
| 16 | `resources/TitleIX.tsx` | `/resources/title-ix` |

**Fix:** Add 16 `<Route>` entries to `App.tsx`.

---

## 3. PLACEHOLDER / INCOMPLETE CONTENT

### 3a. Placeholder Phone Numbers
- `src/pages/international/Collaborations.tsx` -- Phone shows `+1-302-XXX-XXXX` (2 instances)
- `src/pages/legal/Grievance.tsx` -- WhatsApp shows `+91-XXXXXXXXXX`
- `src/pages/legal/RefundPolicy.tsx` -- WhatsApp shows `+91-XXXXXXXXXX`

### 3b. "Coming Soon" Stubs (no real functionality behind them)
| Location | What's Stub |
|----------|-------------|
| `StudentDashboard.tsx` | Academic Records, Library, Career Services, Campus Life, Fee Management -- all say "coming soon" |
| `AdminDashboard.tsx` | "Reports" button triggers a toast saying "coming soon" |
| `AlumniDashboard.tsx` | CTA actions show "coming soon" toast |
| `DelegatorDashboard.tsx` | Commission history section |
| `QuickActions.tsx` | Multiple quick action buttons show "coming soon" toast |
| `SiteEditor.tsx` | Global Settings section |
| `ChatComingSoon.tsx` | Entire intranet chat feature |

---

## 4. BUTTONS / ACTIONS WITH NO REAL LOGIC

- **Student Dashboard Quick Actions** -- multiple buttons just fire a toast with "This feature is coming soon!" instead of navigating or doing anything.
- **Alumni Dashboard CTAs** -- dynamically loaded CTA buttons that fall through to a "coming soon" toast.
- **Admin Reports button** -- shows a toast instead of opening a reports view.

---

## 5. AI COURSE GENERATION STATUS

- **12,001 courses** in the database
- **Only 78** have AI-generated curriculum content (0.65% completion)
- **Queue is currently empty** (no pending/processing items)
- The bulk generator processes at 10-second intervals and has recovery for stuck items

---

## 6. SECURITY ISSUES (from prior audit, still relevant)

These are the critical items flagged in `PROJECT_AUDIT_REPORT.md`:

1. **Privilege escalation** -- `is_admin()`/`is_superadmin()` functions check `profiles.role` instead of `user_roles` table
2. **SMTP credentials exposed** -- `smtp_settings` table lacks RLS policies
3. **Profile PII accessible** -- `profiles` table RLS may be too permissive
4. **User presence tracking public** -- `user_presence` table has no access restrictions

---

## 7. CODE QUALITY NOTES

- **Console statements**: ~142 `console.log`/`console.error` calls across 50+ files (production noise)
- **Tailwind CDN warning** in console: The project loads `cdn.tailwindcss.com` (meant for development only) alongside the proper PostCSS setup
- **Backend folder** (`backend/server.js`) exists but is unused in the Lovable Cloud architecture -- appears to be legacy

---

## 8. DEVELOPMENT SUMMARY

### What's Complete and Working
- Full public university website with 100+ routed pages
- Authentication system with role-based access (student, faculty, admin, agent, alumni, etc.)
- Admin panel with user management, course management, CMS site editor, email system
- AI-powered curriculum generation (7-layer framework) with bulk queue processing
- Dynamic course pages with semester-tabbed curriculum display and horizontal scrolling
- Public course catalog with search/filter and enrollment flow
- Admissions system (standard + fast-track) with agent referral codes
- Alumni dashboard with networking, documents, and chat
- Faculty management and dynamic faculty pages
- Job postings and application system
- Contact form and grievance system
- Transparency portal with financial statements and accreditation data
- 20 deployed Edge Functions for backend operations

### What's Incomplete
- 16 orphan pages need routing
- 78/12,001 courses have AI content (queue needs to run)
- 5 Student Dashboard tabs are stubs
- Chat/messaging system is placeholder
- 3 phone numbers are placeholder
- Admin reports feature is stub
- Site Editor global settings is stub
- Security functions need updating to use `user_roles` table

### Recommended Priority Actions
1. Add the 16 missing routes to `App.tsx`
2. Replace placeholder phone numbers
3. Fix the security functions (`is_admin`, `is_superadmin`)
4. Add RLS policies to `smtp_settings` and `user_presence`
5. Remove the Tailwind CDN script tag
6. Continue running the AI content queue for remaining ~11,923 courses
