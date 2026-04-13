#!/usr/bin/env node

/**
 * Environment validation script
 * Run before deployment to check if all required variables are set
 */

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_DEEPSEEK_API_KEY',
  'VITE_DEEPSEEK_API_URL',
  'VITE_BACKEND_PROVIDER',
];

const optionalVars = [
  'VITE_YOUTUBE_API_KEY',
  'VITE_ANTHROPIC_API_KEY',
  'VITE_FIREBASE_MEASUREMENT_ID',
];

console.log('🔍 Checking environment variables...\n');

let hasError = false;
let hasWarning = false;

// Check required variables
console.log('Required variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`  ❌ ${varName} - MISSING or using placeholder`);
    hasError = true;
  } else {
    console.log(`  ✅ ${varName}`);
  }
});

// Check optional variables
console.log('\nOptional variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`  ⚠️  ${varName} - Not set (features may be limited)`);
    hasWarning = true;
  } else {
    console.log(`  ✅ ${varName}`);
  }
});

// Final status
console.log('\n' + '='.repeat(50));
if (hasError) {
  console.log('❌ Environment check FAILED');
  console.log('Please set all required variables in your .env file');
  console.log('See .env.example for reference');
  process.exit(1);
} else if (hasWarning) {
  console.log('⚠️  Environment check PASSED with warnings');
  console.log('Some optional features may not work');
  console.log('Consider adding optional variables for full functionality');
  process.exit(0);
} else {
  console.log('✅ Environment check PASSED');
  console.log('All variables are configured!');
  process.exit(0);
}
