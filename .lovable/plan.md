

# Password Reset for sudo@govt.ac

## Problem
The `admin-update-password` edge function requires a superadmin JWT token, but since no one can log in, we can't call it. Classic chicken-and-egg.

## Solution
Create a temporary, single-purpose edge function called `reset-sudo-password` that:
1. Does NOT require JWT authentication (`verify_jwt = false`)
2. Accepts a shared secret to prevent unauthorized use
3. Resets the password for `sudo@govt.ac` to `Flamingo_1985`
4. Uses the Supabase service role key to call `auth.admin.updateUserById()`

## Steps

1. **Create `supabase/functions/reset-sudo-password/index.ts`**
   - No JWT required, but validates a hardcoded one-time secret in the request body
   - Looks up the user ID for `sudo@govt.ac` and updates password to `Flamingo_1985`
   - Returns success/failure

2. **Update `supabase/config.toml`** to set `verify_jwt = false` for this function

3. **Call the function** to reset the password

4. **Delete the function** immediately after use (security hygiene)

## Technical Detail
- User ID: `5b68701b-8676-4226-9c0e-7735380320dd`
- New password: `Flamingo_1985` (meets complexity requirements: uppercase, lowercase, number, 8+ chars)

