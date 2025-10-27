#!/usr/bin/env node
require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function backupDatabase () {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log('Starting database backup...');
    console.log(`Backup file: ${backupFile}`);

    const useDocker = (process.env.USE_DOCKER === 'true') || !!process.env.DOCKER_DB_CONTAINER;
    const dockerContainer = process.env.DOCKER_DB_CONTAINER || 'skillwise-db';
    const dbUser = process.env.DB_USER || 'skillwise_user';
    const dbName = process.env.DB_NAME || 'skillwise_db';

    let command;

    if (useDocker) {
      // Run pg_dump inside the Docker container (requires docker to be available on host)
      command = `docker exec -i ${dockerContainer} pg_dump -U ${dbUser} ${dbName} > "${backupFile}"`;
      console.log('Using Docker container for backup:', dockerContainer);
    } else if (process.env.DATABASE_URL) {
      // Use local pg_dump with DATABASE_URL; prefer -f for writing output portably
      // Note: pg_dump must be installed on the machine running this script
      command = `pg_dump "${process.env.DATABASE_URL}" -f "${backupFile}"`;
      console.log('Using local pg_dump with DATABASE_URL');
    } else {
      console.error('No backup method available. Set USE_DOCKER=true or DOCKER_DB_CONTAINER, or install pg_dump and set DATABASE_URL.');
      process.exit(2);
    }

    await runCommand(command);

    console.log('Database backup completed successfully!');
    console.log(`Backup saved to: ${backupFile}`);
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

function runCommand (command) {
  return new Promise((resolve, reject) => {
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        if (stdout) console.log(stdout);
        if (stderr) console.warn(stderr);
        resolve(stdout);
      }
    });
  });
}

if (require.main === module) {
  backupDatabase();
}

module.exports = { backupDatabase };
