/**
 * SkillWise API – Main Express Application
 * Central app configuration with middleware, routing, and error handling.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pino = require('pino');
const pinoHttp = require('pino-http');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Routes
const routes = require('./routes');

// Initialize app
const app = express();

/* ---------------------------------------------------------
 * Logger Setup (Pino)
 * --------------------------------------------------------- */
const logger = pino({
  name: 'skillwise-api',
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});

// Attach request logging middleware
app.use(
  pinoHttp({
    logger,
    autoLogging: true,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
      }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

/* ---------------------------------------------------------
 * Security Middleware
 * --------------------------------------------------------- */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        scriptSrc: ['\'self\''],
        imgSrc: ['\'self\'', 'data:', 'https:'],
      },
    },
  }),
);

/* ---------------------------------------------------------
 * CORS Configuration
 * --------------------------------------------------------- */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

/* ---------------------------------------------------------
 * Rate Limiting
 * --------------------------------------------------------- */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/* ---------------------------------------------------------
 * Body Parsing
 * --------------------------------------------------------- */
app.use(
  express.json({
    limit: '10mb',
    strict: true,
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  }),
);

/* ---------------------------------------------------------
 * Health Check
 * --------------------------------------------------------- */
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'SkillWise API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

/* ---------------------------------------------------------
 * API Routing
 * --------------------------------------------------------- */
app.use('/api', routes);

/* ---------------------------------------------------------
 * 404 Fallback
 * --------------------------------------------------------- */
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

/* ---------------------------------------------------------
 * Global Error Handler
 * --------------------------------------------------------- */
app.use(errorHandler);

/* ---------------------------------------------------------
 * Export
 * --------------------------------------------------------- */
app.set('logger', logger);
module.exports = app;
