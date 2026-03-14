# 🔧 Magic Link Redirect Issue - Troubleshooting Guide

## Problem
Magic link opens home page instead of admin dashboard.

## Root Cause
Supabase needs the redirect URL explicitly whitelisted in the dashboard.

---

## ✅ Solution Steps

### Step 1: Add Redirect URL in Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `fbodtxxxfluerszkajwg`

2. **Navigate to Authentication Settings:**
   - Click **Authentication** (left sidebar)
   - Click **URL Configuration**

3. **Add Redirect URLs:**
   - Find the section: **"Redirect URLs"**
   - Click **"Add URL"**
   - Add these URLs (one at a time):
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/*
     ```
   - Click **Save**

### Step 2: Verify Email Template (Optional)

1. In Supabase Dashboard → **Authentication** → **Email Templates**
2. Find the **"Confirm signup"** or **"Magic Link"** template
3. Verify the button/link uses: `{{ .ConfirmationURL }}`
4. This should already be correct by default

### Step 3: Clear Browser Data

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Cookies**
3. Delete all cookies for `localhost:3000`
4. Close DevTools

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test Again

1. Go to: http://localhost:3000/login
2. Enter your admin email
3. Click "Send Magic Link"
4. Check your email
5. Click the magic link
6. **Expected:** Opens http://localhost:3000/admin ✅
7. **Not:** Opens http://localhost:3000/ ❌

---

## 🔍 Debugging

### Check Browser Console
1. Open DevTools (F12) → Console tab
2. Look for these log messages after clicking magic link:
   ```
   Session established for: your-email@example.com
   Admin verified, redirecting to /admin
   ```

### Check Network Tab
1. Open DevTools (F12) → Network tab
2. Click magic link
3. Look for:
   - Request to `/auth/callback?code=xxx`
   - Response status: 307 (Redirect)
   - Location header: `http://localhost:3000/admin`

### Check Supabase Auth Logs
1. Supabase Dashboard → **Authentication** → **Logs**
2. Look for recent login attempts
3. Check for any errors

---

## 🚨 Common Issues

### Issue 1: Redirect URL Not Whitelisted

**Symptoms:**
- Magic link redirects to home page
- No errors in console
- Auth callback never runs

**Fix:**
- Add `http://localhost:3000/auth/callback` to Supabase redirect URLs (Step 1 above)

### Issue 2: Cookie Not Persisting

**Symptoms:**
- Console shows "Session established"
- Still redirects to login after

**Fix:**
- Make sure cookies are enabled in browser
- Try incognito/private mode
- Clear all localhost cookies

### Issue 3: Admin Email Not in Database

**Symptoms:**
- Console shows: "Admin verification failed"
- Redirects to `/login?error=unauthorized`

**Fix:**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM admin_users WHERE email = 'your-email@example.com';

-- If not found, add:
INSERT INTO admin_users (email, is_active) VALUES ('your-email@example.com', true);
```

### Issue 4: Wrong Redirect URL in Email

**Symptoms:**
- Magic link goes to wrong domain
- Email link has different URL than localhost

**Fix:**
- Supabase uses the redirect URL from when magic link was requested
- Make sure you're testing on http://localhost:3000/login
- Not http://127.0.0.1:3000/login (different origin)

---

## ✅ Verification Checklist

Run through this checklist in order:

- [ ] Environment variables configured (.env.local)
- [ ] Redirect URL added in Supabase Dashboard
- [ ] Admin email exists in admin_users table
- [ ] Email provider enabled in Supabase
- [ ] Browser cookies cleared
- [ ] Dev server restarted
- [ ] Using http://localhost:3000 (not 127.0.0.1)
- [ ] Magic link clicked in same browser

---

## 📝 Test Sequence

```bash
# 1. Verify redirect URLs in Supabase Dashboard
✅ http://localhost:3000/auth/callback is whitelisted

# 2. Start fresh
npm run dev

# 3. Open browser (not incognito)
http://localhost:3000/login

# 4. Request magic link
Email: your-admin-email@example.com
→ Click "Send Magic Link"
→ Wait for success message

# 5. Check email
→ Open email from Supabase
→ Click the magic link button

# 6. Expected flow:
URL changes: /auth/callback?code=xxx
     ↓
Console: "Session established for: your-email@example.com"
     ↓
Console: "Admin verified, redirecting to /admin"
     ↓
URL becomes: /admin
     ↓
Shows: Admin Dashboard ✅
```

---

## 🆘 Still Not Working?

If you've completed all steps above and it still doesn't work:

1. **Check auth callback console logs:**
   ```bash
   # Look in terminal where dev server is running
   # Should see these after clicking magic link:
   Session established for: your-email@example.com
   Admin verified, redirecting to /admin
   ```

2. **Try different browser:**
   - Chrome → Firefox or Edge
   - Sometimes browser cookie policies differ

3. **Check Supabase project status:**
   - Dashboard → Project Settings → General
   - Verify project is not paused

4. **Manual verification:**
   ```bash
   # In browser console after clicking magic link:
   fetch('/auth/callback?code=YOUR_CODE_FROM_EMAIL')
   .then(r => console.log(r))
   ```

---

## 📞 Quick Fix Summary

**Most common fix (90% of cases):**

1. Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URL: `http://localhost:3000/auth/callback`
3. Save
4. Clear browser cookies
5. Try again

**If that doesn't work:**

1. Check terminal logs for errors
2. Verify admin email in database
3. Check browser console for JavaScript errors
4. Restart dev server

---

## ✨ Success Indicators

You'll know it's working when:

- ✅ Magic link redirects to `/admin` (not home page)
- ✅ Admin dashboard loads
- ✅ Sidebar shows: Vehicles, Charging Stations, etc.
- ✅ Session persists (can refresh page and stay logged in)
- ✅ Can add/edit/delete data

---

**After fixing, you should be able to:**
1. Click magic link → Opens admin dashboard
2. Navigate all admin pages
3. Add/edit/delete vehicles, stations, and fuel prices
4. Logout and login again successfully
