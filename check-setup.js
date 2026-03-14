#!/usr/bin/env node
/**
 * EVGuide SL - Authentication Setup Checker
 * 
 * This script verifies that your local development environment
 * is configured correctly for authentication.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 EVGuide SL - Setup Verification');
console.log('=====================================\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: .env.local file exists
console.log('📁 Checking environment configuration...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('  ✅ .env.local file exists');
  
  // Read and check environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = [];
  const placeholderVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    } else {
      const lineMatch = envContent.match(new RegExp(`${varName}=(.+)`));
      if (lineMatch && lineMatch[1]) {
        const value = lineMatch[1].trim();
        if (value.includes('your_') || value.includes('here') || value === '') {
          placeholderVars.push(varName);
        } else {
          console.log(`  ✅ ${varName} is configured`);
        }
      }
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`  ❌ Missing variables: ${missingVars.join(', ')}`);
    hasErrors = true;
  }
  
  if (placeholderVars.length > 0) {
    console.log(`  ⚠️  Placeholder values found in: ${placeholderVars.join(', ')}`);
    console.log('     Please update these with your actual Supabase credentials');
    hasWarnings = true;
  }
} else {
  console.log('  ❌ .env.local file not found!');
  console.log('     Please create this file with your Supabase credentials');
  hasErrors = true;
}

console.log();

// Check 2: Required files exist
console.log('📄 Checking setup files...');
const requiredFiles = [
  'supabase-schema.sql',
  'setup-admin-user.sql',
  'verify-setup.sql',
  'SETUP_INSTRUCTIONS.md'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} exists`);
  } else {
    console.log(`  ❌ ${file} not found`);
    hasErrors = true;
  }
});

console.log();

// Check 3: Key authentication files
console.log('🔐 Checking authentication files...');
const authFiles = [
  'app/login/page.tsx',
  'app/login/LoginClient.tsx',
  'app/auth/callback/route.ts',
  'middleware.ts',
  'lib/supabase.ts',
  'lib/supabase-server.ts',
  'app/admin/layout.tsx',
  'app/admin/page.tsx'
];

authFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} missing`);
    hasErrors = true;
  }
});

console.log();

// Check 4: Node modules
console.log('📦 Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('  ✅ node_modules directory exists');
  
  // Check for critical dependencies
  const deps = ['@supabase/supabase-js', 'next', 'react'];
  deps.forEach(dep => {
    const depPath = path.join(__dirname, 'node_modules', dep);
    if (fs.existsSync(depPath)) {
      console.log(`  ✅ ${dep} installed`);
    } else {
      console.log(`  ❌ ${dep} not found - run: npm install`);
      hasErrors = true;
    }
  });
} else {
  console.log('  ❌ node_modules not found');
  console.log('     Run: npm install');
  hasErrors = true;
}

console.log();
console.log('=====================================');

if (hasErrors) {
  console.log('❌ SETUP INCOMPLETE');
  console.log('\nPlease fix the errors above before testing authentication.');
  console.log('See SETUP_INSTRUCTIONS.md for detailed setup guide.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  SETUP MOSTLY COMPLETE');
  console.log('\nWarnings found. Please review and update configuration.');
  console.log('\nNext steps:');
  console.log('1. Update .env.local with real Supabase credentials');
  console.log('2. Run supabase-schema.sql in Supabase SQL Editor');
  console.log('3. Run setup-admin-user.sql with YOUR email');
  console.log('4. Enable Email provider in Supabase Dashboard');
  console.log('5. Add redirect URL: http://localhost:3000/auth/callback');
  console.log('6. Start dev server: npm run dev');
  console.log('7. Test login: http://localhost:3000/login');
  process.exit(0);
} else {
  console.log('✅ ✅ ✅ ALL CHECKS PASSED! ✅ ✅ ✅');
  console.log('\n🎉 Your local environment is configured correctly!');
  console.log('\nNext steps:');
  console.log('1. Run supabase-schema.sql in Supabase SQL Editor (if not done)');
  console.log('2. Run setup-admin-user.sql with YOUR email (if not done)');
  console.log('3. Enable Email provider in Supabase Dashboard');
  console.log('4. Add redirect URL: http://localhost:3000/auth/callback');
  console.log('5. Start dev server: npm run dev');
  console.log('6. Test login: http://localhost:3000/login');
  console.log('\n📖 For detailed instructions, see: SETUP_INSTRUCTIONS.md');
  process.exit(0);
}
