

# Fix: Reset superadmin password via Edge Function

## Problem
Login fails with `invalid_credentials` across all projects. The password stored in Supabase Auth does not match what's being entered. This is NOT a database or infrastructure issue.

## Why moving to Neon is not viable
- Lovable Cloud cannot be disconnected once enabled
- Authentication lives in the Auth service, not the data tables
- The `npx neonctl` CLI is for Cursor/Claude Code editors, not Lovable
- The database is healthy -- queries, roles, and profiles all work correctly

## Solution: Password Reset (1 step)

### Step 1: Reset the password for `sudo@govt.ac`

Use the existing `admin-update-password` Edge Function to set a new password for the superadmin account.

The user will provide the new desired password, and the function will update it in the Auth service using the Supabase Admin API (service role key).

If the edge function has issues, a fallback approach is to call `supabase.auth.admin.updateUserById()` directly from a small dedicated edge function.

### After reset
- User logs in with the new password
- No code changes, no database changes, no infrastructure changes needed
- If the same issue exists on other projects, the same password reset approach applies per-project (each has its own Auth database)

## What is NOT changing
- No database migration
- No Neon integration
- No code modifications
- No schema changes

