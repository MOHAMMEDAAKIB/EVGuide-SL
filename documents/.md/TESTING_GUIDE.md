# 🧪 EVGuide SL - Authentication Testing Guide

Quick reference for testing the admin authentication system.

## ✅ Pre-Testing Checklist

Run the setup verification script:
```bash
node check-setup.js
```

All checks should pass before proceeding.

---

## 🚀 Quick Start Testing

### 1. Start Development Server

```bash
npm run dev
```

Wait for: `✓ Ready in X.XXs`

### 2. Test Login Flow

**Step 2.1: Access Login Page**
- Open: http://localhost:3000/login
- ✅ Page loads without errors
- ✅ Shows "Admin Login" heading
- ✅ Has email input field
- ✅ Has "Send Magic Link" button

**Step 2.2: Request Magic Link**
- Enter your admin email (must match email in `admin_users` table)
- Click "Send Magic Link"
- ✅ Button shows loading state
- ✅ Success message appears: "Check your email for a magic link!"
- ⚠️ If error: Check console and verify Supabase credentials

**Step 2.3: Check Email**
- Open your email inbox (check spam/junk too)
- ✅ Email from Supabase received within 1-2 minutes
- Subject: "Confirm your signup" or similar
- ✅ Contains magic link button/link

**Step 2.4: Click Magic Link**
- Click the magic link in email
- ✅ Browser opens to: `http://localhost:3000/auth/callback?code=xxxxx`
- ✅ Redirects to: `http://localhost:3000/admin`
- ❌ If redirects back to `/login`: Session/cookie issue (see troubleshooting)

**Step 2.5: Verify Admin Dashboard**
- URL should be: `/admin`
- ✅ Shows "Admin Dashboard" heading
- ✅ Displays statistics cards (vehicles, stations, fuel prices)
- ✅ Sidebar shows navigation menu
- ✅ User email displayed in header/sidebar

---

## 🔍 Detailed Feature Testing

### A. Route Protection Testing

**Test 1: Access Admin Without Login**
1. Open incognito/private window
2. Navigate to: http://localhost:3000/admin
3. ✅ Should redirect to: `/login?redirect=/admin`
4. ✅ Cannot access admin pages without authentication

**Test 2: Middleware Protection**
1. Log out (click logout in admin sidebar)
2. Try to access: `/admin/vehicles`
3. ✅ Should redirect to `/login`

**Test 3: Session Persistence**
1. Login successfully
2. Close browser tab
3. Open new tab and go to: http://localhost:3000/admin
4. ✅ Should remain logged in (session persists)

---

### B. Vehicle Management Testing

**Test 1: View Vehicles Page**
1. Login and navigate to: `/admin/vehicles`
2. ✅ Page loads with vehicle list
3. ✅ Shows "Add Vehicle" button
4. ✅ Can see existing vehicles (if any)

**Test 2: Add New Vehicle**
1. Click "Add Vehicle"
2. ✅ Modal/form opens
3. Fill in required fields:
   - Make: Tesla
   - Model: Model 3
   - Year: 2024
   - Price: 15000000
   - Battery Capacity: 75
   - Range: 450
4. Click "Save"
5. ✅ Vehicle appears in list
6. ✅ Success toast/message shown
7. ⚠️ If error: Check browser console and RLS policies

**Test 3: Edit Vehicle**
1. Find the vehicle you just added
2. Click "Edit" button
3. ✅ Form pre-filled with vehicle data
4. Change Model to "Model 3 Long Range"
5. Click "Save"
6. ✅ Vehicle updated in list
7. ✅ Changes persisted

**Test 4: Delete Vehicle**
1. Click "Delete" on a vehicle
2. ✅ Confirmation dialog appears
3. Click "Confirm"
4. ✅ Vehicle removed from list
5. ✅ Success message shown

---

### C. Charging Station Management Testing

**Test 1: Navigate to Charging Stations**
1. Click "Charging Stations" in sidebar
2. ✅ Page loads: `/admin/charging-stations`
3. ✅ Shows list of stations (if any)
4. ✅ "Add Charging Station" button visible

**Test 2: Add Charging Station**
1. Click "Add Charging Station"
2. Fill in:
   - Name: Colombo City Center Charging Hub
   - Operator: LECO
   - Address: Lotus Tower, Colombo 1
   - City: Colombo
   - Province: Western
   - Country: Sri Lanka
   - Latitude: 6.9271
   - Longitude: 79.8612
   - Connector Types: Select multiple (CCS, Type 2)
   - Power Output: 50
   - Number of Stations: 4
   - Operating Hours: 24/7
   - Status: Operational
3. Click "Save"
4. ✅ Station appears in list
5. ✅ All fields display correctly

**Test 3: Edit Charging Station**
1. Edit a station
2. Change status to "Under Maintenance"
3. Save
4. ✅ Status updated

**Test 4: Delete Charging Station**
1. Delete a station
2. ✅ Confirmation required
3. ✅ Deleted successfully

---

### D. Fuel Price Management Testing

**Test 1: View Fuel Prices**
1. Navigate to: `/admin/fuel-prices`
2. ✅ Shows current and historical fuel prices
3. ✅ Ordered by effective date (newest first)

**Test 2: Add Fuel Price**
1. Click "Add Fuel Price"
2. Fill in:
   - Fuel Type: Octane 92
   - Price: 365
   - Effective Date: Today's date
3. Click "Save"
4. ✅ New price added
5. ✅ Previous price for same fuel type auto-deactivated
6. ✅ Only one active price per fuel type

**Test 3: Update Fuel Price**
1. Edit an active fuel price
2. Change price from 365 to 370
3. Save
4. ✅ Price updated
5. ✅ Other fuel type prices unaffected

**Test 4: Historical Data**
1. Add multiple fuel prices for same type on different dates
2. ✅ All appear in list
3. ✅ Ordered by date
4. ✅ Only most recent is marked active

---

## 🔐 Security Testing

### Test 1: Service Role Key Protection
1. Open browser DevTools → Network tab
2. Perform any admin action (add vehicle, etc.)
3. ✅ Check request headers
4. ✅ Should NOT see service role key
5. ✅ Should only see anon key in client requests

### Test 2: Non-Admin Email Rejection
1. Logout
2. Try to login with email NOT in `admin_users` table
3. Click magic link
4. ✅ Should redirect back to `/login?error=unauthorized`
5. ✅ Should show error message

### Test 3: Inactive Admin Rejection
1. In Supabase, set your admin user to `is_active = false`:
   ```sql
   UPDATE admin_users SET is_active = false WHERE email = 'your-email';
   ```
2. Try to login
3. ✅ Should be rejected even after clicking magic link
4. Reset: `UPDATE admin_users SET is_active = true WHERE email = 'your-email';`

---

## 📊 Performance Testing

### Test 1: Large Dataset
1. Add 20+ vehicles to database
2. Navigate to vehicles page
3. ✅ Page loads in reasonable time (< 3 seconds)
4. ✅ No console errors
5. ✅ Smooth scrolling

### Test 2: Multiple Tabs
1. Open admin dashboard in 2 browser tabs
2. Make changes in tab 1
3. Refresh tab 2
4. ✅ Changes reflected
5. ✅ Session maintained in both tabs

---

## 🐛 Error Scenario Testing

### Test 1: Network Offline
1. Open DevTools → Network → ⚠️ Offline
2. Try to add vehicle
3. ✅ Should show appropriate error message
4. ✅ Should not crash app

### Test 2: Invalid Data
1. Try to add vehicle with:
   - Empty required fields
   - Negative price
   - Invalid year (e.g., 1800)
2. ✅ Form validation should prevent submission
3. ✅ Clear error messages shown

### Test 3: Expired Session
1. Login successfully
2. Wait for session to expire (default: 1 hour)
3. Try to perform action
4. ✅ Should redirect to login
5. ✅ Should preserve redirect URL

---

## 🎯 Expected Test Results

| Test Category | Expected Pass Rate |
|--------------|-------------------|
| Login Flow | 100% |
| Route Protection | 100% |
| Vehicle CRUD | 100% |
| Charging Station CRUD | 100% |
| Fuel Price CRUD | 100% |
| Security Tests | 100% |
| Error Handling | 100% |

---

## 📝 Testing Checklist

Copy this checklist and mark off as you test:

```
✅ Local Setup
  ☐ check-setup.js passes all checks
  ☐ .env.local configured
  ☐ supabase-schema.sql executed
  ☐ Admin user configured in database

✅ Login & Authentication
  ☐ Login page loads
  ☐ Magic link sends successfully
  ☐ Email received
  ☐ Magic link redirects to /admin
  ☐ Session persists across tabs
  ☐ Logout works correctly

✅ Vehicle Management
  ☐ View vehicles list
  ☐ Add new vehicle
  ☐ Edit vehicle
  ☐ Delete vehicle
  ☐ Form validation works

✅ Charging Station Management
  ☐ View stations list
  ☐ Add new station
  ☐ Edit station
  ☐ Delete station
  ☐ Multi-select connectors work

✅ Fuel Price Management
  ☐ View fuel prices
  ☐ Add new price
  ☐ Edit price
  ☐ Auto-deactivation works
  ☐ Historical data displays

✅ Security & Route Protection
  ☐ Cannot access /admin without login
  ☐ Non-admin emails rejected
  ☐ Inactive admins rejected
  ☐ Service role key not exposed

✅ Error Handling
  ☐ Network errors handled gracefully
  ☐ Invalid data validation
  ☐ Session expiry handled
```

---

## 🔧 Quick Fixes for Common Issues

### Issue: Magic link redirects to /login
**Fix:**
1. Restart dev server
2. Clear browser cookies for localhost
3. Verify middleware.ts has proper cookie handling
4. Check browser console for errors

### Issue: "Unauthorized" error on API calls
**Fix:**
1. Verify session with:
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   console.log(session);
   ```
2. Check RLS policies in Supabase
3. Verify admin email in admin_users table

### Issue: Form submission fails
**Fix:**
1. Check browser console for errors
2. Verify all required fields filled
3. Check network tab for API response
4. Verify RLS policies allow INSERT/UPDATE

---

## 📞 Getting Help

If tests fail:
1. Check `SETUP_INSTRUCTIONS.md` for configuration
2. Run `node check-setup.js` again
3. Check Supabase Dashboard → Authentication → Logs
4. Check browser console for errors
5. Check terminal for server errors

---

**Happy Testing! 🚀**
