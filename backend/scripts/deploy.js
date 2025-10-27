#!/usr/bin/env node

require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const CWD = path.resolve(__dirname, '..');

function sh (cmd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, {
      cwd: CWD,
      shell: true,
      stdio: 'inherit',
      env: { ...process.env },
    });
    child.on('exit', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`Command failed (${code}): ${cmd}`));
    });
  });
}

async function deploy () {
  try {
    console.log('Starting deployment process...');

    console.log('Installing dependencies...');
    await sh('npm install');

    console.log('Running tests...');
    await sh('npm test');

    console.log('Running linter...');
    await sh('npm run lint');

    console.log('Building application...');
    await sh('npm run build');

    console.log('Running database migrations...');
    await sh('npm run migrate');

    console.log('Deployment completed successfully.');
    const port = process.env.PORT || 3001;

    console.log(`\nTo start the server in production mode:
NODE_ENV=production npm start

On Windows PowerShell:
$env:NODE_ENV="production"; npm start

Verify:
http://localhost:${port}/healthz
http://localhost:${port}/api`);
  } catch (err) {
    console.error('Deployment failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}

module.exports = { deploy };
