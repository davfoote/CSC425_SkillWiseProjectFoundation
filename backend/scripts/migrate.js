// TODO: implement simple migration runner
const fs = require('fs');
const path = require('path');

console.log('Migration runner placeholder - list migration files:');
const migrationsDir = path.join(__dirname, '..', 'src', 'database', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
  console.log(files.join('\n'));
} else {
  console.log('No migrations directory found');
}
