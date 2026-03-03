-- =====================================================
-- Create Admin User Script
-- =====================================================
-- This script helps you create admin users in the system.
-- 
-- IMPORTANT: You MUST first create the user in Supabase Auth!
-- 
-- Steps:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter email and password
-- 4. ✅ CHECK "Auto Confirm User"
-- 5. Create the user
-- 6. Then run this SQL script with the same email
-- =====================================================

-- Add a new admin user to the admin_users table
-- Replace 'admin@example.com' with the actual admin email
INSERT INTO admin_users (email, is_active, created_at)
VALUES ('admin@example.com', true, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  is_active = true,
  updated_at = NOW();

-- Verify the admin user was created
SELECT * FROM admin_users WHERE email = 'admin@example.com';

-- =====================================================
-- Additional Admin User Management Queries
-- =====================================================

-- View all admin users
-- SELECT * FROM admin_users ORDER BY created_at DESC;

-- Deactivate an admin user (without deleting)
-- UPDATE admin_users SET is_active = false WHERE email = 'admin@example.com';

-- Reactivate an admin user
-- UPDATE admin_users SET is_active = true WHERE email = 'admin@example.com';

-- Delete an admin user
-- DELETE FROM admin_users WHERE email = 'admin@example.com';

-- Count active admin users
-- SELECT COUNT(*) as active_admins FROM admin_users WHERE is_active = true;
