-- =====================================================
-- EVGuide SL - Setup Verification Script
-- =====================================================
-- 
-- Run this script to verify your database setup is correct.
-- This will check all tables, RLS policies, and admin users.
--
-- =====================================================

-- Check 1: Verify all required tables exist
SELECT 
    'Table Check' as test_name,
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ PASS - All 4 tables exist'
        ELSE '❌ FAIL - Missing tables. Expected 4, found ' || COUNT(*)
    END as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('vehicles', 'charging_stations', 'fuel_prices', 'admin_users');

-- Check 2: Verify admin_users table structure
SELECT 
    'Admin Users Table Structure' as test_name,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ PASS - Admin users table has correct columns'
        ELSE '❌ FAIL - Admin users table is missing columns'
    END as result
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'admin_users'
AND column_name IN ('id', 'email', 'is_active', 'created_at');

-- Check 3: Verify admin users exist and are active
SELECT 
    'Active Admin Users' as test_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS - Found ' || COUNT(*) || ' active admin(s)'
        ELSE '❌ FAIL - No active admin users found. Run setup-admin-user.sql!'
    END as result,
    STRING_AGG(email, ', ') as admin_emails
FROM public.admin_users 
WHERE is_active = true;

-- Check 4: Verify RLS is enabled
SELECT 
    'RLS Enabled Check' as test_name,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ PASS - RLS enabled on ' || tablename
        ELSE '❌ FAIL - RLS NOT enabled on ' || tablename
    END as result
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('vehicles', 'charging_stations', 'fuel_prices', 'admin_users')
ORDER BY tablename;

-- Check 5: Verify INSERT policies exist for admin operations
SELECT 
    'INSERT Policies Check' as test_name,
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS - ' || COUNT(*) || ' INSERT policy found'
        ELSE '❌ FAIL - No INSERT policy found'
    END as result
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('vehicles', 'charging_stations', 'fuel_prices')
AND cmd = 'INSERT'
GROUP BY tablename
ORDER BY tablename;

-- Check 6: Count records in each table
SELECT 
    'Record Counts' as test_name,
    '📊 Data Overview' as result;

SELECT 'Vehicles' as table_name, COUNT(*) as record_count FROM public.vehicles
UNION ALL
SELECT 'Charging Stations', COUNT(*) FROM public.charging_stations
UNION ALL
SELECT 'Fuel Prices', COUNT(*) FROM public.fuel_prices
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM public.admin_users;

-- Check 7: Verify index on admin_users email
SELECT 
    'Database Indexes' as test_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS - Email index exists on admin_users'
        ELSE '⚠️ WARNING - No email index found (performance may be impacted)'
    END as result
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename = 'admin_users'
AND indexname LIKE '%email%';

-- =====================================================
-- Summary Report
-- =====================================================

SELECT 
    '=======================' as divider,
    '📋 SETUP SUMMARY' as section,
    '=======================' as divider2;

-- Final verdict
SELECT 
    CASE 
        WHEN (
            -- All tables exist
            (SELECT COUNT(*) FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name IN ('vehicles', 'charging_stations', 'fuel_prices', 'admin_users')) = 4
            -- At least one active admin exists
            AND (SELECT COUNT(*) FROM public.admin_users WHERE is_active = true) > 0
            -- RLS is enabled on all tables
            AND (SELECT COUNT(*) FROM pg_tables 
                 WHERE schemaname = 'public'
                 AND tablename IN ('vehicles', 'charging_stations', 'fuel_prices', 'admin_users')
                 AND rowsecurity = true) = 4
        ) THEN '✅ ✅ ✅ ALL CHECKS PASSED! Database is ready for authentication. ✅ ✅ ✅'
        ELSE '❌ SETUP INCOMPLETE - Please fix the issues above and run this script again.'
    END as overall_status;

-- =====================================================
-- Next Steps
-- =====================================================

SELECT 
    '📝 NEXT STEPS' as section,
    CASE 
        WHEN (SELECT COUNT(*) FROM public.admin_users WHERE is_active = true) = 0 
        THEN '1. Run setup-admin-user.sql to add your admin email
2. Verify .env.local has correct Supabase credentials
3. Start dev server: npm run dev
4. Test login at: http://localhost:3000/login'
        ELSE '1. Verify .env.local has correct Supabase credentials
2. Enable Email provider in Supabase Dashboard
3. Add redirect URL: http://localhost:3000/auth/callback
4. Start dev server: npm run dev
5. Test login at: http://localhost:3000/login'
    END as instructions;
