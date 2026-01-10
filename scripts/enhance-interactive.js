#!/usr/bin/env node
// Interactive enhancement script
// Prompts for POSTGRES_URL and runs enhancement batches

const readline = require('readline');
const { spawn } = require('child_process');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎬 Børnespilguiden - Interactive AI Enhancement');
console.log('');

// Check if POSTGRES_URL is already set
if (process.env.POSTGRES_URL) {
  console.log('✅ POSTGRES_URL already set in environment');
  runEnhancement(process.env.POSTGRES_URL);
} else {
  console.log('Please enter your POSTGRES_URL from Vercel:');
  console.log('(Get it from: https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables)');
  console.log('');

  rl.question('POSTGRES_URL: ', (postgresUrl) => {
    rl.close();

    if (!postgresUrl || !postgresUrl.startsWith('postgresql://')) {
      console.error('❌ Invalid POSTGRES_URL. Must start with postgresql://');
      process.exit(1);
    }

    runEnhancement(postgresUrl);
  });
}

function runEnhancement(postgresUrl) {
  console.log('');
  console.log('🚀 Starting enhancement batches...');
  console.log('');

  // Load ANTHROPIC_API_KEY from .env
  const envContent = fs.readFileSync('.env', 'utf8');
  const apiKeyMatch = envContent.match(/ANTHROPIC_API_KEY="(.+)"/);

  if (!apiKeyMatch) {
    console.error('❌ ANTHROPIC_API_KEY not found in .env');
    process.exit(1);
  }

  const env = {
    ...process.env,
    POSTGRES_URL: postgresUrl,
    ANTHROPIC_API_KEY: apiKeyMatch[1]
  };

  // Run first batch
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 Batch 1: 35 items');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const batch1 = spawn('node', ['scripts/test-enhancement.js', '35'], { env });

  batch1.stdout.on('data', (data) => process.stdout.write(data));
  batch1.stderr.on('data', (data) => process.stderr.write(data));

  batch1.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Batch 1 failed with exit code ${code}`);
      process.exit(code);
    }

    console.log('');
    console.log('✅ Batch 1 complete!');
    console.log('');
    console.log('⏸️  Waiting 5 seconds before Batch 2...');

    setTimeout(() => {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 Batch 2: 35 items');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');

      const batch2 = spawn('node', ['scripts/test-enhancement.js', '35'], { env });

      batch2.stdout.on('data', (data) => process.stdout.write(data));
      batch2.stderr.on('data', (data) => process.stderr.write(data));

      batch2.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ Batch 2 failed with exit code ${code}`);
          process.exit(code);
        }

        console.log('');
        console.log('✅ Both batches complete!');
        console.log('');
        console.log('📊 To check final status, run:');
        console.log(`   POSTGRES_URL='${postgresUrl}' node scripts/check-enhancement-status.js`);

        process.exit(0);
      });
    }, 5000);
  });
}
