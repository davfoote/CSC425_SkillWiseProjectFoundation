// TODO: Implement DB connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || null,
});

module.exports = pool;
