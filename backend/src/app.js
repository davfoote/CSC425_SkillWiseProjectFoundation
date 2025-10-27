// Express app scaffold with common middleware
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');

const app = express();

// Logging (pino)
app.use(
	pinoHttp({
		level: process.env.LOG_LEVEL || 'info',
	})
);

// Security headers
app.use(helmet());

// CORS - allow configured origin or localhost by default
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || '*',
		credentials: true,
	})
);

// Basic rate limiting
app.use(
	rateLimit({
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
		max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
	})
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/healthz', (req, res) => {
	res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount API routes (loaded from src/routes/index.js)
app.use('/api', require('./routes'));

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler (exports from src/middleware/errorHandler.js)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
