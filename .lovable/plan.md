
# Bulk Course Content Generator - Implementation Plan

## Overview

Build a background processing queue system that generates AI curriculum content for courses with:
- **30-second delay** between each course generation (to avoid rate limits)
- **Background processing** that continues even when admin navigates away
- **Notifications** with course code for each completed generation
- **Auto-save** of generated content immediately after each successful generation

---

## Architecture

```text
+------------------+       +-------------------+       +----------------------+
|  Admin UI        |------>| Queue Table       |------>| Processing Worker    |
|  (Select courses)|       | (Persistent)      |       | (Edge Function)      |
+------------------+       +-------------------+       +----------------------+
        |                         |                            |
        v                         v                            v
  Bulk Select Dialog       content_generation_queue     generate-curriculum-v2
  - Filter by faculty      - id, course_id, status      (existing function)
  - Filter by department   - priority, retries
  - Add to queue button    - created_at, updated_at
        |                  - error_message                     |
        v                         |                            v
  Queue Monitor                   v                     Auto-save to
  - Real-time status       Supabase Realtime          academic_courses
  - Notifications          (Live UI updates)
```

---

## Key Features

### 1. 30-Second Processing Gap
- Each course waits 30 seconds before the next one starts
- Prevents rate limiting (429 errors)
- Allows API quotas to reset between requests

### 2. Background Processing
- Queue persists in database
- Processing continues even if admin closes browser
- Admin can return later to see progress
- Uses polling from frontend to trigger processor

### 3. Notifications System
- Toast notification for each completed course: "✓ Generated: CS-101 - Computer Science Fundamentals"
- Toast notification for failures: "✗ Failed: PHY-201 - Error message"
- Notification bell with count of completed items since last visit
- Store notifications in database for persistence

### 4. Auto-Save
- Immediately save generated content to `academic_courses.ai_generated_content`
- Update `content_generated_at` timestamp
- No manual save required - content is saved as soon as generated

---

## Database Schema

### Table: `content_generation_queue`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `course_id` | UUID | Reference to academic_courses |
| `course_code` | TEXT | Cached for notifications |
| `course_name` | TEXT | Cached for notifications |
| `status` | TEXT | `pending` / `processing` / `completed` / `failed` |
| `priority` | INTEGER | Lower = higher priority (default 10) |
| `retries` | INTEGER | Number of retry attempts (max 3) |
| `error_message` | TEXT | Last error if failed |
| `started_at` | TIMESTAMPTZ | When processing began |
| `completed_at` | TIMESTAMPTZ | When finished |
| `created_at` | TIMESTAMPTZ | When added to queue |
| `created_by` | UUID | Admin who queued it |

### Table: `content_generation_notifications`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `queue_item_id` | UUID | Reference to queue item |
| `course_code` | TEXT | For display |
| `course_name` | TEXT | For display |
| `status` | TEXT | `completed` / `failed` |
| `message` | TEXT | Success/error message |
| `is_read` | BOOLEAN | Has user seen this? |
| `created_at` | TIMESTAMPTZ | When notification created |
| `user_id` | UUID | Target admin user |

---

## Processing Strategy

| Parameter | Value |
|-----------|-------|
| **Delay between requests** | **30 seconds** |
| Concurrent processing | 1 at a time (sequential) |
| Max retries per item | 3 |
| Backoff on 429 error | 60 seconds then retry |
| Pause on 402 error | Stop queue, notify admin |
| Batch size for UI | 50 courses at a time |

---

## Edge Function: `process-content-queue`

### Logic Flow

```text
1. Query next pending item (ORDER BY priority, created_at LIMIT 1)
2. If none found → return { idle: true, nextCheckIn: 30 }
3. Mark as 'processing', set started_at
4. Fetch course details from academic_courses
5. Call generate-curriculum-v2 with course data
6. If success:
   a. AUTO-SAVE: Update academic_courses with generated content
   b. Mark queue item as 'completed', set completed_at
   c. Create notification: "✓ {course_code} generated successfully"
   d. Return { processed: true, nextIn: 30 }
7. If 429 (rate limit):
   a. Mark as 'pending' with retries++
   b. Return { rateLimited: true, retryAfter: 60 }
8. If 402 (payment required):
   a. Create notification: "⚠ Credits exhausted - queue paused"
   b. Return { paused: true, reason: 'credits_exhausted' }
9. If other error:
   a. Mark as 'failed' with error_message
   b. Create notification: "✗ {course_code} failed: {error}"
   c. Return { processed: true, failed: true, nextIn: 30 }
```

### Response Structure

```json
{
  "processed": true,
  "courseCode": "CS-101",
  "courseName": "Computer Science Fundamentals",
  "status": "completed",
  "nextProcessIn": 30,
  "queueRemaining": 847,
  "notification": {
    "type": "success",
    "message": "Generated curriculum for CS-101"
  }
}
```

---

## Frontend Components

### 1. BulkContentGenerator.tsx

Main component with:
- Queue statistics dashboard
- Course selection with filters
- Queue controls (Start/Pause/Clear)
- Real-time progress updates

### 2. QueueMonitor.tsx

Live queue display:
- Currently processing item with elapsed time
- Pending items list
- Completed items (last 20)
- Failed items with retry option

### 3. NotificationBell.tsx

Notification indicator:
- Badge count of unread notifications
- Dropdown with recent notifications
- Mark as read functionality
- Click to view course details

---

## Frontend Polling Strategy

```typescript
// Polling logic with 30-second intervals
const POLL_INTERVAL = 30000; // 30 seconds

useEffect(() => {
  if (queueStatus === 'running' && pendingCount > 0) {
    const interval = setInterval(async () => {
      const result = await supabase.functions.invoke('process-content-queue');
      
      if (result.data?.processed) {
        // Show toast notification
        toast({
          title: result.data.status === 'completed' 
            ? `✓ Generated: ${result.data.courseCode}` 
            : `✗ Failed: ${result.data.courseCode}`,
          description: result.data.courseName
        });
      }
      
      if (result.data?.paused) {
        setQueueStatus('paused');
        toast.error('Queue paused: Credits exhausted');
      }
    }, POLL_INTERVAL);
    
    return () => clearInterval(interval);
  }
}, [queueStatus, pendingCount]);
```

---

## UI Mockup

```text
┌─────────────────────────────────────────────────────────────┐
│ 7-Layer AI Curriculum Generator                    [🔔 23]  │
├─────────────────────────────────────────────────────────────┤
│ [Single Course] [Bulk Generate]                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Queue Status:  ● Running (30s between each)                  │
│ ┌──────────┬───────────┬──────────┬──────────┐              │
│ │ Pending  │ Processing │ Completed│ Failed   │              │
│ │   847    │     1      │    152   │    3     │              │
│ └──────────┴───────────┴──────────┴──────────┘              │
│                                                              │
│ Estimated time remaining: ~7 hours 5 minutes                 │
│                                                              │
│ [⏸ Pause Queue] [🗑 Clear Queue] [🔄 Retry Failed]          │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│ Currently Processing                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔄 CS-101 - Computer Science Fundamentals               │ │
│ │    Elapsed: 45s | Next course in: 30s                   │ │
│ │    ████████████████████░░░░░░░░░░░░░ Generating...      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│ Recent Activity                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✓ MBA-301 - Strategic Management (just now) [Auto-saved]│ │
│ │ ✓ ENG-201 - Circuit Analysis (30s ago) [Auto-saved]     │ │
│ │ ✓ PHY-101 - Physics I (1m ago) [Auto-saved]             │ │
│ │ ✗ CHEM-401 - Organic Chemistry - "Timeout" [Retry]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│ Add to Queue                                                 │
│ Faculty: [All ▼] Department: [All ▼] □ Without content only │
│                                                              │
│ ☑ Course 1 - Data Structures (DS-201)                       │
│ ☑ Course 2 - Algorithms (ALG-301)                           │
│ ☑ Course 3 - Machine Learning (ML-401)                      │
│ ... (50 of 847 shown)                                       │
│                                                              │
│ [☑ Select All Filtered (847)] [➕ Add Selected to Queue]    │
└─────────────────────────────────────────────────────────────┘
```

---

## Notification Bell Dropdown

```text
┌──────────────────────────────────┐
│ 🔔 Notifications (23 new)        │
├──────────────────────────────────┤
│ ✓ CS-101 generated      just now │
│ ✓ MBA-301 generated        30s   │
│ ✓ ENG-201 generated        1m    │
│ ✗ CHEM-401 failed          2m    │
│ ✓ PHY-101 generated        3m    │
│ ...                              │
├──────────────────────────────────┤
│ [Mark all as read] [View all]    │
└──────────────────────────────────┘
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/process-content-queue/index.ts` | Background processor with 30s logic |
| `src/components/admin/academic/BulkContentGenerator.tsx` | Main bulk generator UI |
| `src/components/admin/academic/QueueMonitor.tsx` | Live queue display |
| `src/components/admin/academic/NotificationBell.tsx` | Notification indicator |
| `src/hooks/useContentQueue.ts` | Queue state management hook |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/academic/CourseContentGenerator.tsx` | Add "Bulk Generate" tab |
| `supabase/config.toml` | Register new edge function |

---

## Database Migration SQL

```sql
-- Queue table
CREATE TABLE content_generation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER DEFAULT 10,
  retries INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(course_id)
);

-- Notifications table
CREATE TABLE content_generation_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_item_id UUID REFERENCES content_generation_queue(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE content_generation_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE content_generation_notifications;

-- RLS policies
ALTER TABLE content_generation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generation_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage queue"
  ON content_generation_queue FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their notifications"
  ON content_generation_notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON content_generation_notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their notifications"
  ON content_generation_notifications FOR UPDATE
  USING (user_id = auth.uid());
```

---

## Time Estimates for 12,000 Courses

| Metric | Value |
|--------|-------|
| Processing time per course | ~15-30 seconds |
| Gap between courses | 30 seconds |
| Total time per course | ~45-60 seconds |
| 100 courses | ~1.5 hours |
| 1,000 courses | ~15 hours |
| 12,000 courses | ~7.5 days |

*Note: Can be run continuously in background. Admin doesn't need to keep browser open.*

---

## Edge Cases Handled

| Scenario | Solution |
|----------|----------|
| Admin closes browser | Queue persists, resumes when admin returns |
| Rate limit (429) | Wait 60s, retry automatically |
| Credits exhausted (402) | Pause queue, create urgent notification |
| Course deleted while queued | CASCADE delete removes queue entry |
| Duplicate queue entry | UNIQUE constraint prevents duplicates |
| Network timeout | Retry up to 3 times, then mark failed |
| Generation takes >30s | Wait for completion, then 30s gap starts |
| Server restart | Queue persists, continues on next poll |
