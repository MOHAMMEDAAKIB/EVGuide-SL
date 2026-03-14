# Email/Password Authentication Setup Guide

## Overview
The application now uses **email/password authentication** instead of magic link authentication. This provides a simpler, more reliable login experience for admin users.

## What Changed

### Previous System (Magic Link)
- Admin entered email address
- System sent a "magic link" via email
- Admin clicked link in email to log in
- Required email delivery to work properly

### Current System (Email/Password)
- Admin enters email and password
- System authenticates directly
- Immediate login (no email required)
- More reliable and traditional authentication flow

## Files Modified

1. **`app/login/LoginClient.tsx`**
   - Changed from `signInWithOtp()` to `signInWithPassword()`
   - Added password input field with show/hide toggle
   - Added admin verification check during login
   - Updated UI text and buttons

2. **`app/auth/callback/route.ts`**
   - Simplified and documented
   - Now only handles special cases (password reset, OAuth, etc.)
   - Regular login no longer uses this route

3. **Middleware and Other Components**
   - No changes needed - they work with both systems

## Setting Up Admin Users in Supabase

### Step 1: Create User in Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** → **"Create new user"**
4. Enter:
   - **Email**: The admin's email address
   - **Password**: A secure password (min 6 characters)
   - **Auto Confirm User**: ✅ **Check this box** (important!)
5. Click **"Create user"**

### Step 2: Add User to admin_users Table

After creating the user in Supabase Auth, you need to add them to the `admin_users` table:

```sql
INSERT INTO admin_users (email, is_active, created_at)
VALUES ('admin@example.com', true, NOW());
```

Or use the Supabase Table Editor:
1. Go to **Table Editor** → **admin_users**
2. Click **"Insert row"**
3. Fill in:
   - **email**: Same email as Supabase Auth user
   - **is_active**: `true`
   - **created_at**: (auto-filled)

### Step 3: Verify the Setup

1. Go to your login page: `http://localhost:3000/login`
2. Enter the email and password you created
3. Click **"Sign In"**
4. You should be redirected to `/admin`

## Important Supabase Configuration

### Email Confirmation Settings

For email/password authentication to work smoothly, ensure these settings in Supabase:

1. Go to **Authentication** → **Providers** → **Email**
2. Configure:
   - **Enable email provider**: ✅ Enabled
   - **Confirm email**: ❌ **Disabled** (for development)
   - **Secure email change**: Your preference
   - **Secure password change**: Your preference

> **Note**: For production, you may want to enable email confirmation. You'll need to handle the confirmation flow in your app.

### Password Policy

The default Supabase password policy requires:
- Minimum 6 characters

You can adjust this in **Authentication** → **Policies** if needed.

## Security Features

The login system includes:
- ✅ Password visibility toggle (eye icon)
- ✅ Client-side form validation
- ✅ Admin verification (checks `admin_users` table)
- ✅ Automatic sign-out if user is not an admin
- ✅ Loading states and error messages
- ✅ Session persistence via cookies
- ✅ Middleware protection for `/admin` routes

## Troubleshooting

### Problem: "Invalid login credentials"
**Solution**: 
- Verify the email and password are correct
- Check that the user exists in Supabase Auth
- Ensure "Auto Confirm User" was checked when creating the user

### Problem: "Access denied. You must be an active admin"
**Solution**: 
- Check that the user exists in the `admin_users` table
- Verify `is_active` is set to `true`
- Ensure the email matches exactly (case-sensitive)

### Problem: "User already registered" when creating user
**Solution**: 
- User already exists in Supabase Auth
- You can either use the existing user or delete and recreate

### Problem: Login succeeds but immediately logs out
**Solution**: 
- Check browser console for errors
- Verify middleware is correctly configured
- Check that cookies are being set properly (browser dev tools → Application → Cookies)

## Testing the Login Flow

1. **Test successful login**:
   ```
   Email: admin@example.com
   Password: [your password]
   Expected: Redirect to /admin
   ```

2. **Test invalid credentials**:
   ```
   Email: admin@example.com
   Password: wrongpassword
   Expected: Error message "Invalid login credentials"
   ```

3. **Test non-admin user**:
   ```
   Email: user@example.com (not in admin_users)
   Password: [valid password]
   Expected: Error message "Access denied"
   ```

4. **Test logout**:
   ```
   Click "Logout" in admin sidebar
   Expected: Redirect to /login
   ```

## Migration from Magic Link

If you have existing admin users who were using magic link:

1. **Option 1**: Create new passwords for existing users
   - Go to Supabase → Authentication → Users
   - Find the user
   - Click "..." → "Reset password"
   - Set a new password manually

2. **Option 2**: Use "Forgot Password" flow (requires implementation)
   - You would need to implement a password reset feature
   - Users would receive an email with a reset link
   - The auth callback route is already prepared for this

## Future Enhancements

Consider adding these features:

- **Password Reset**: Allow users to reset forgotten passwords
- **Email Verification**: Require new users to verify their email
- **Two-Factor Authentication**: Add extra security layer
- **Session Management**: View and revoke active sessions
- **Password Strength Indicator**: Help users create strong passwords
- **Login Attempt Limiting**: Prevent brute force attacks

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

No changes to environment variables are needed for this authentication change.

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Session Management Best Practices](https://supabase.com/docs/guides/auth/sessions)
