# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Immediate Actions Required

If you're setting up this application for the first time or if credentials were previously exposed, follow these steps immediately:

### 1. Database Credentials (CRITICAL)

**If database credentials were exposed, IMMEDIATELY rotate them:**

1. Login to your database hosting provider (premium12.web-hosting.com)
2. Change the password for user `rajvardhan_nscu`
3. Update the `backend/.env` file with new credentials:
   ```bash
   DATABASE_URL=postgresql://username:NEW_PASSWORD@host:5432/database
   ```

### 2. SMTP Credentials (CRITICAL)

**If SMTP credentials were exposed (`ncore@nscu.govt.ac`), IMMEDIATELY:**

1. Change the email password at your email provider
2. Configure new SMTP settings in the admin dashboard (do NOT hardcode them)
3. Use the Admin Panel → Email Settings to configure securely

### 3. JWT Secret (CRITICAL)

**Generate a secure JWT secret:**

```bash
# Generate a secure 32-byte random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `backend/.env`:
```
JWT_SECRET=<your-generated-secret-here>
```

### 4. Environment Files

**Never commit these files to git:**

- `backend/.env`
- `.env` (if you create one)

**Verify .gitignore includes:**
```
backend/.env
.env
*.env.local
```

## 🛡️ Security Features Implemented

### ✅ Privilege Escalation Prevention
- Admin functions (`is_admin()`, `is_superadmin()`) now check `user_roles` table only
- Users cannot modify their own roles
- Trigger prevents role self-modification

### ✅ Credential Protection
- No hardcoded database credentials
- No hardcoded SMTP passwords
- No hardcoded JWT secrets
- All secrets in environment variables

### ✅ Edge Function Security
- `admin-update-password` checks `user_roles` table
- Proper admin verification before password updates

### ✅ Authentication
- AuthContext uses `user_roles` as single source of truth
- No fallback to `profiles.role`
- Reduced console logging of sensitive data

## 📋 Security Checklist for Production

Before deploying to production:

- [ ] All database passwords rotated if previously exposed
- [ ] All SMTP passwords rotated if previously exposed
- [ ] JWT secret generated and set in environment variable
- [ ] `backend/.env` file created with all required secrets
- [ ] `.gitignore` updated to exclude all `.env` files
- [ ] Git history cleaned if secrets were committed (use git-filter-repo)
- [ ] All console.log statements removed from production code
- [ ] Input validation added to all forms (Zod schemas)
- [ ] Rate limiting enabled on authentication
- [ ] RLS policies verified on all tables
- [ ] All users have roles in `user_roles` table
- [ ] MFA enabled in Supabase Auth settings
- [ ] Database backup configured
- [ ] Monitoring and alerting set up

## 🔐 User Roles Architecture

**IMPORTANT:** Roles MUST be stored in the `user_roles` table, NOT in the `profiles` table.

```sql
-- Correct way to check admin status
SELECT EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() 
  AND role = 'superadmin'
);

-- WRONG - DO NOT USE
SELECT role FROM profiles WHERE user_id = auth.uid();
```

### Why?

- `profiles.role` can potentially be modified by users
- `user_roles` table has strict RLS policies
- Security functions check `user_roles` only
- This prevents privilege escalation attacks

## 📝 Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=<32-byte-random-hex>
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Supabase Secrets (via Dashboard)
- `CPANEL_API_TOKEN` - For email account management
- `CPANEL_HOST` - cPanel hostname
- `CPANEL_USERNAME` - cPanel username
- `OPENAI_API_KEY` - For AI features
- (Add others as needed)

## 🚨 Incident Response

If you suspect a security breach:

1. **Immediately rotate all credentials**
2. **Revoke all active sessions:** Run in Supabase SQL editor:
   ```sql
   -- This will force all users to re-login
   UPDATE auth.users SET updated_at = NOW();
   ```
3. **Check audit logs** for suspicious activity
4. **Review RLS policies** for any gaps
5. **Scan application logs** for unauthorized access attempts
6. **Document the incident** and timeline
7. **Notify affected users** if personal data was accessed

## 📞 Support

For security concerns, contact:
- IT Support: itsupport@nscu.govt.ac
- Security Team: security@nscu.govt.ac

---

**Last Updated:** [Current Date]
**Security Review:** Completed - Critical vulnerabilities fixed
