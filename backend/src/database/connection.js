// Database connection helpers
// Uses DATABASE_URL by default; falls back to individual env vars if provided.
const { Pool } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  (process.env.PG_CONNECTION_STRING || null);

const pool = new Pool({
  connectionString,
  // allow the pool to pick sensible defaults; options can be extended here
});

async function query(text, params) {
  return pool.query(text, params);
}

// withTransaction: accepts an async function that receives a client and runs within
// a BEGIN/COMMIT/ROLLBACK transaction. Returns the value returned by fn.
async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      // eslint-disable-next-line no-console
      console.error('Rollback error', rollbackErr);
    }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query,
  withTransaction,
};
