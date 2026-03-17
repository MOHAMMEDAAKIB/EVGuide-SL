-- =====================================================
-- Fix RLS Policy for admin_users Table
-- =====================================================
-- This fixes the "Access denied" error during login
-- by allowing authenticated users to check if their 
-- own email exists in the admin_users table.
-- =====================================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow admin read access to admin users" ON public.admin_users;

-- Create a new policy that allows authenticated users to read their own row
CREATE POLICY "Allow authenticated users to read their own admin status"
    ON public.admin_users FOR SELECT
    USING (
        auth.uid() IS NOT NULL 
        AND email = auth.jwt()->>'email'
    );

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'admin_users';
