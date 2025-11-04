#!/usr/bin/env node
// verify-setup.js - Verify server setup and dependencies

console.log('🔍 Verifying Telegram Bot Server Setup\n');
console.log('='.repeat(60));

let errors = [];
let warnings = [];

// 1. Check Node.js version
console.log('\n1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 18) {
  console.log(`   ✓ Node.js ${nodeVersion} (>= 18 required)`);
} else {
  errors.push(`Node.js version ${nodeVersion} is too old. Requires >= 18.0.0`);
  console.log(`   ❌ Node.js ${nodeVersion} (requires >= 18)`);
}

// 2. Check required files
console.log('\n2️⃣  Checking required files...');
const fs = require('fs');
const requiredFiles = [
  'server.js',
  'package.json',
  'src/config.js',
  'src/webhook.js',
  'src/claude-integration.js',
  'src/github-integration.js',
  'src/usda-api.js'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`   ✓ ${file} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    errors.push(`Missing required file: ${file}`);
    console.log(`   ❌ ${file} (not found)`);
  }
});

// 3. Check package.json dependencies
console.log('\n3️⃣  Checking dependencies...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['telegraf', 'axios', 'dotenv', 'js-yaml', 'express'];

requiredDeps.forEach(dep => {
  if (pkg.dependencies[dep]) {
    console.log(`   ✓ ${dep}@${pkg.dependencies[dep]}`);
  } else {
    errors.push(`Missing dependency: ${dep}`);
    console.log(`   ❌ ${dep} (not in package.json)`);
  }
});

// 4. Check if dependencies are installed
console.log('\n4️⃣  Checking installed packages...');
requiredDeps.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`   ✓ ${dep} installed`);
  } catch (error) {
    warnings.push(`Package not installed: ${dep}. Run 'npm install'`);
    console.log(`   ⚠️  ${dep} not installed`);
  }
});

// 5. Check .env file
console.log('\n5️⃣  Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('   ✓ .env file exists');

  const dotenv = require('dotenv');
  dotenv.config();

  const requiredEnvVars = [
    'TELEGRAM_BOT_TOKEN',
    'ANTHROPIC_API_KEY',
    'GITHUB_TOKEN'
  ];

  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      const value = process.env[envVar];
      const preview = value.substring(0, 10) + '...' + value.substring(value.length - 4);
      console.log(`   ✓ ${envVar} = ${preview}`);
    } else {
      warnings.push(`Environment variable not set: ${envVar}`);
      console.log(`   ⚠️  ${envVar} not set`);
    }
  });

  const optionalEnvVars = [
    'GITHUB_OWNER',
    'GITHUB_REPO',
    'GITHUB_BRANCH',
    'PORT',
    'WEBHOOK_URL',
    'NODE_ENV'
  ];

  console.log('\n   Optional variables:');
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`   ✓ ${envVar} = ${process.env[envVar]}`);
    } else {
      console.log(`   - ${envVar} (using default)`);
    }
  });
} else {
  warnings.push('.env file not found. Create one from .env.example');
  console.log('   ⚠️  .env file not found');
}

// 6. Syntax check server.js
console.log('\n6️⃣  Syntax check...');
try {
  const { execSync } = require('child_process');
  execSync('node -c server.js', { stdio: 'pipe' });
  console.log('   ✓ server.js syntax valid');
} catch (error) {
  errors.push('Syntax error in server.js');
  console.log('   ❌ server.js has syntax errors');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Summary\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Server is ready to run.\n');
  console.log('Next steps:');
  console.log('  1. npm install    (if not done yet)');
  console.log('  2. npm run dev    (start development server)');
  console.log('  3. Visit /setup   (register webhook with Telegram)');
} else {
  if (errors.length > 0) {
    console.log('❌ Critical Errors:\n');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:\n');
    warnings.forEach((warn, i) => {
      console.log(`   ${i + 1}. ${warn}`);
    });
  }

  console.log('\nFix these issues before running the server.');
}

console.log('\n' + '='.repeat(60));
