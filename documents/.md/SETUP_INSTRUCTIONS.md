# 🚀 EVGuide SL - Authentication Setup Instructions

This guide will help you configure the authentication system to enable admin login and database management.

## 📋 Prerequisites

- ✅ Supabase project created
- ✅ Node.js and npm installed
- ✅ Project dependencies installed (`npm install`)

---

## 🔧 Step-by-Step Setup

### Step 1: Configure Environment Variables

1. **Open `.env.local`** file (already created in project root)

2. **Get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to: **Project Settings** → **API**

3. **Copy the following values into `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (copy the "anon public" key)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (copy the "service_role secret" key)
   ```

4. **Save the file** ⚠️ Never commit this file to git!

---

### Step 2: Setup Database Schema

1. **Open Supabase Dashboard** → **SQL Editor** → **New Query**

2. **Copy entire contents** from `supabase-schema.sql` file

3. **Paste and Run** the SQL script

4. **Verify tables created:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('vehicles', 'charging_stations', 'fuel_prices', 'admin_users');
   ```
   Should return 4 rows.

---

### Step 3: Configure Supabase Authentication

#### 3.1 Enable Email Provider

1. Go to: **Authentication** → **Providers**
2. Find "Email" in the list
3. **Toggle ON** if it's disabled
4. Click **Save**

#### 3.2 Configure Magic Link Email (Optional)

1. Still in **Authentication** → **Providers** → **Email**
2. Customize the email template if desired
3. Default template works fine for testing

#### 3.3 Add Redirect URLs

1. Go to: **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```
3. For production, also add:
   ```
   https://yourdomain.com/auth/callback
   ```
4. Click **Save**

---

### Step 4: Setup Admin User

1. **Edit `setup-admin-user.sql`** file

2. **Replace** `'your-email@example.com'` with **YOUR actual email address**:
   ```sql
   INSERT INTO public.admin_users (email, is_active) 
   VALUES ('your-actual-email@gmail.com', true)
   ```

3. **Run in Supabase SQL Editor:**
   - Copy the entire contents of `setup-admin-user.sql`
   - Paste into SQL Editor
   - Click **Run**

4. **Verify admin user created:**
   ```sql
   SELECT * FROM admin_users WHERE is_active = true;
   ```
   Should show your email with `is_active = true`.

---

### Step 5: Test Authentication

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** [http://localhost:3000/login](http://localhost:3000/login)

3. **Enter your admin email** (same one you added to `admin_users` table)

4. **Click "Send Magic Link"**
   - You should see: "Check your email for a magic link!"

5. **Check your email inbox** (and spam folder!)
   - Look for email from your Supabase project
   - Click the magic link in the email

6. **Verify redirect to admin dashboard:**
   - URL should be: `http://localhost:3000/admin`
   - You should see the admin dashboard
   - Sidebar shows: Dashboard, Vehicles, Charging Stations, Fuel Prices

7. **Test CRUD operations:**
   - Click "Vehicles" → "Add Vehicle"
   - Fill out the form
   - Click "Save"
   - Verify vehicle appears in the list

---

## ✅ Verification Checklist

Use this checklist to ensure everything is configured correctly:

- [ ] `.env.local` file created with all 3 environment variables filled in
- [ ] `supabase-schema.sql` executed successfully in Supabase
- [ ] Email provider enabled in Supabase Dashboard
- [ ] Redirect URL `http://localhost:3000/auth/callback` added
- [ ] Admin user added to `admin_users` table with YOUR email
- [ ] `admin_users` query returns your email with `is_active = true`
- [ ] Dev server started (`npm run dev`)
- [ ] Login page loads at `/login`
- [ ] Magic link email received
- [ ] Clicking magic link redirects to `/admin` (not `/login`)
- [ ] Admin dashboard displays correctly
- [ ] Can add, edit, and delete vehicles

---

## 🐛 Troubleshooting

### Issue: "Invalid login credentials" error

**Solutions:**
- Verify your email in `admin_users` table matches EXACTLY the email you're logging in with
- Check for typos or extra spaces
- Run: `SELECT * FROM admin_users WHERE email = 'your-email@example.com';`

### Issue: Magic link redirects back to `/login`

**Solutions:**
- Restart dev server: `npm run dev`
- Clear browser cookies for `localhost:3000`
- Verify redirect URL is whitelisted in Supabase
- Check browser console for errors
- Verify environment variables are loaded:
  ```javascript
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  ```

### Issue: "Unauthorized" after clicking magic link

**Solutions:**
- Verify you added your email to `admin_users` table
- Check `is_active` is `true`:
  ```sql
  UPDATE admin_users SET is_active = true WHERE email = 'your-email@example.com';
  ```
- Check Supabase Auth logs: Dashboard → Authentication → Logs

### Issue: No magic link email received

**Solutions:**
- Check spam/junk folder
- Verify Email provider is enabled in Supabase
- Check Supabase Auth logs for errors
- Try a different email address
- Wait a few minutes (email delivery can be delayed)

### Issue: Environment variables not loading

**Solutions:**
- Restart dev server completely (Ctrl+C then `npm run dev`)
- Verify `.env.local` is in project root (same folder as `package.json`)
- Check file name is exactly `.env.local` (not `.env.local.txt`)
- No spaces around `=` in env file

### Issue: Database permissions errors

**Solutions:**
- Verify RLS policies are created (run `supabase-schema.sql` again)
- Check you're using the correct Supabase keys
- Verify `admin_users` table exists:
  ```sql
  \dt admin_users
  ```

---

## 🔒 Security Notes

### Production Deployment

Before deploying to production:

1. **Update redirect URLs** in Supabase to include your production domain
2. **Never commit `.env.local`** to version control
3. **Set environment variables** in your hosting platform (Vercel, Netlify, etc.)
4. **Enable HTTPS** for all production URLs
5. **Consider adding rate limiting** to prevent abuse
6. **Monitor authentication logs** regularly

### Security Best Practices

- ✅ Service role key is only used in server-side code
- ✅ All database tables have RLS (Row Level Security) enabled
- ✅ Admin verification happens at multiple layers
- ✅ Session-based authentication with automatic refresh
- ⚠️ Consider adding email domain whitelist for production
- ⚠️ Consider implementing rate limiting on login attempts

---

## 📞 Support

If you encounter issues not covered in troubleshooting:

1. Check Supabase documentation: https://supabase.com/docs
2. Check Next.js documentation: https://nextjs.org/docs
3. Review authentication logs in Supabase Dashboard
4. Check browser console for JavaScript errors
5. Check terminal for server errors

---

## 🎯 What's Next?

Once authentication is working:

1. **Add real vehicle data** through the admin interface
2. **Add charging stations** across Sri Lankan locations
3. **Update fuel prices** as they change
4. **Customize the admin dashboard** to your needs
5. **Deploy to production** when ready

---

**System Status:** ✅ All code implementation complete. Just needs configuration!
