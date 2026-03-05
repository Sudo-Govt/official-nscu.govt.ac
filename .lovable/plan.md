

# Plan: Integrate External PHP API for Student Study Materials

## Overview
Create an edge function proxy to securely call the external PHP API at `govt.ac`, then build a `StudyMaterialsTab` component that lists and streams files (PDFs/videos) for each student. Add a "Study Materials" tab to the student dashboard.

## Why an Edge Function Proxy?
The secret token must not be exposed in the browser. An edge function will hold the token server-side and proxy requests to the PHP API.

## Steps

### 1. Store the API Token as a Secret
Use the `add_secret` tool to store `COURSEWARE_API_TOKEN` so the edge function can access it securely.

### 2. Create Edge Function: `fetch-courseware`
**File:** `supabase/functions/fetch-courseware/index.ts`

- Accepts `GET` requests with query param `file` (the path inside `Student_Courseware`)
- Reads `COURSEWARE_API_TOKEN` from environment
- Calls `https://govt.ac?file={file}&token={token}`
- Streams the response back (PDF or video) with correct `Content-Type` passthrough
- Includes CORS headers
- Has a `list` mode: when called with `?action=list`, returns the directory listing (if the PHP API supports it) -- otherwise returns a hardcoded or database-driven file list

### 3. Create `StudyMaterialsTab` Component
**File:** `src/components/student/StudyMaterialsTab.tsx`

- On mount, calls the edge function with `?action=list` to get available files for the student
- Displays files in a card grid grouped by type (Videos / Documents)
- For videos: renders a `<video>` player with `src` pointing to the edge function URL + file path
- For PDFs/docs: opens in a new tab or inline `<iframe>` viewer via the edge function URL
- Shows loading states and error handling

### 4. Add "Study Materials" Tab to Student Dashboard
**File:** `src/components/dashboards/StudentDashboardV2.tsx`

- Import `StudyMaterialsTab`
- Add a new `TabsTrigger` with value `"study-materials"` and a `Video` icon, labeled "Study Materials"
- Add corresponding `TabsContent` rendering `<StudyMaterialsTab />`
- Place it after "My Files" tab

### 5. Test connectivity
- First, verify the edge function can reach `govt.ac` and return data
- If the PHP API doesn't support listing files, we'll need the user to provide file paths or store them in a database table

## Important Consideration
The PHP API endpoint details suggest it serves individual files. We need to confirm whether it supports listing available files for a student. If not, we may need a `student_courseware` database table where admins map file paths to student IDs. I'll build both the proxy and a fallback approach.

