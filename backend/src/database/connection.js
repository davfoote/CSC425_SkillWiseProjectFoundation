// PostgreSQL database connection and configuration
require('dotenv').config();
const { Pool } = require('pg');
const pino = require('pino');

const logger = pino({
  name: 'skillwise-db',
  level: process.env.LOG_LEVEL || 'info',
});

// Build a connection string if DATABASE_URL isn't provided
const fallbackUrl = `postgresql://${process.env.DB_USER || 'skillwise_user'}:${process.env.DB_PASSWORD || 'skillwise_pass'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'skillwise_db'}`;

// Pool configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || fallbackUrl,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: { rejectUnauthorized: false },
  }),
  max: Number(process.env.DB_POOL_MAX || 20),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONN_TIMEOUT_MS || 2000),
};

// DB connection string is logged via application logger when needed; avoid noisy console output here.

// Create pool
const pool = new Pool(dbConfig);

// Pool event hooks
pool.on('connect', () => {
  logger.debug('Database client connected');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Database pool error');
});

pool.on('remove', () => {
  logger.debug('Database client removed from pool');
});

// Simple connectivity check
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS now');
    client.release();
    logger.info({ at: result.rows[0].now }, 'Database connection successful');
    return true;
  } catch (err) {
    logger.error({ err }, 'Database connection failed');
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (err) {
    logger.error({ err }, 'Error closing database pool');
  }
};

// Query helper
const query = async (text, params = []) => {
  const start = Date.now();
  const queryId = Math.random().toString(36).slice(2, 10);

  try {
    logger.debug({
      queryId,
      preview: text.length > 120 ? `${text.slice(0, 120)}…` : text,
      paramCount: params.length,
    }, 'Executing query');

    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    logger.debug({ queryId, durationMs: duration, rows: result.rowCount, command: result.command }, 'Query completed');
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    logger.error({
      queryId,
      durationMs: duration,
      preview: text.length > 120 ? `${text.slice(0, 120)}…` : text,
      code: err.code,
      detail: err.detail,
      err,
    }, 'Query failed');
    throw err;
  }
};

// Transaction helper (auto-rollback on error)
const withTransaction = async (callback) => {
  const client = await pool.connect();
  const txId = Math.random().toString(36).slice(2, 10);

  try {
    logger.debug({ txId }, 'Starting transaction');
    await client.query('BEGIN');

    const txQuery = async (text, params = []) => {
      const start = Date.now();
      try {
        const result = await client.query(text, params);
        logger.debug({ txId, durationMs: Date.now() - start, rows: result.rowCount }, 'TX query');
        return result;
      } catch (err) {
        logger.error({ txId, err }, 'TX query failed');
        throw err;
      }
    };

    const result = await callback(txQuery);
    await client.query('COMMIT');
    logger.debug({ txId }, 'Transaction committed');
    return result;
  } catch (err) {
    logger.warn({ txId, err }, 'Transaction failed, rolling back');
    try {
      await client.query('ROLLBACK');
      logger.debug({ txId }, 'Transaction rolled back');
    } catch (rbErr) {
      logger.error({ txId, err: rbErr }, 'Rollback failed');
    }
    throw err;
  } finally {
    client.release();
    logger.debug({ txId }, 'Database client released');
  }
};

// DB health info (useful for /healthz)
const healthCheck = async () => {
  try {
    const result = await query('SELECT version(), NOW() AS current_time, current_database() AS database');
    return {
      healthy: true,
      version: result.rows[0].version,
      currentTime: result.rows[0].current_time,
      database: result.rows[0].database,
      poolSize: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingClients: pool.waitingCount,
    };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
};

module.exports = {
  pool,
  query,
  withTransaction,
  getClient: () => pool.connect(),
  healthCheck,
  testConnection,
  closePool,
};
