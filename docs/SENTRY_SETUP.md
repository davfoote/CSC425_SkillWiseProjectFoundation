# Sentry Error Tracking Setup

This guide explains how to configure Sentry error tracking for the SkillWise application.

## Overview

Sentry is integrated into both frontend (React) and backend (Node.js/Express) to capture and monitor errors in real-time.

## Quick Start (Testing Without Sentry Account)

The application works **without** Sentry configured. When Sentry DSN is not provided:
- ✅ Application runs normally
- ✅ Errors are logged to console
- ❌ No error tracking dashboard
- ❌ No alerts/notifications

**Debug endpoints are available at:**
- `GET /api/debug/health` - Health check
- `GET /api/debug/error` - Test sync error
- `GET /api/debug/sentry-message` - Test Sentry message
- Frontend: Click "🐛 Error Tests" button (bottom-right)

## Full Setup (With Sentry Account)

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for free account
3. Create a new project for **Node.js** (backend)
4. Create a new project for **React** (frontend)

### 2. Get DSN URLs

After creating each project, copy the DSN URL:
- Format: `https://[key]@[org].ingest.sentry.io/[project-id]`

### 3. Configure Backend

**File:** `backend/.env`

```env
# Add this line with your backend DSN
SENTRY_DSN_BACKEND=https://your-backend-key@your-org.ingest.sentry.io/your-project-id
```

### 4. Configure Frontend

**File:** `frontend/.env`

```env
# Uncomment and add your frontend DSN
REACT_APP_SENTRY_DSN=https://your-frontend-key@your-org.ingest.sentry.io/your-project-id
```

### 5. Restart Services

```bash
# Stop backend if running
pkill -f "node server.js"

# Start backend
cd backend && npm start

# In another terminal, start frontend
cd frontend && npm start
```

### 6. Test Error Tracking

#### Backend Tests:
```bash
# Test Sentry message
curl http://localhost:3001/api/debug/sentry-message

# Test error capture
curl http://localhost:3001/api/debug/error

# Test error with context
curl http://localhost:3001/api/debug/error-with-context
```

#### Frontend Tests:
1. Open application: `http://localhost:3000`
2. Click "🐛 Error Tests" button (bottom-right corner)
3. Click any test button to trigger an error
4. Check Sentry dashboard for captured errors

## Features Enabled

### Backend Features
- ✅ HTTP request tracking
- ✅ Express middleware integration
- ✅ Performance profiling
- ✅ Error context and breadcrumbs
- ✅ Custom tags and user context
- ✅ Environment-based sampling

### Frontend Features
- ✅ Browser performance tracking
- ✅ Session replay on errors
- ✅ React error boundaries
- ✅ Network request tracking
- ✅ User interaction breadcrumbs

## Debug Endpoints

Available in development/test environments only (`NODE_ENV !== 'production'`):

| Endpoint | Description |
|----------|-------------|
| `GET /api/debug/health` | Health check - shows Sentry status |
| `GET /api/debug/error` | Triggers synchronous error |
| `GET /api/debug/async-error` | Triggers async error |
| `GET /api/debug/unhandled-rejection` | Triggers unhandled promise rejection |
| `GET /api/debug/sentry-message` | Sends info message to Sentry |
| `GET /api/debug/error-with-context` | Error with custom context/tags |
| `GET /api/debug/database-error` | Simulates database error |
| `GET /api/debug/validation-error` | Simulates validation error |

## Viewing Errors in Sentry

1. Go to [sentry.io](https://sentry.io)
2. Select your project (Backend or Frontend)
3. Navigate to **Issues** tab
4. Click on any error to see:
   - Stack trace
   - Request context
   - User information
   - Breadcrumbs (events leading to error)
   - Session replay (frontend only)

## Environment Variables Reference

### Backend (.env)
```env
SENTRY_DSN_BACKEND=your-sentry-backend-dsn-url
NODE_ENV=development  # or 'production'
```

### Frontend (.env)
```env
REACT_APP_SENTRY_DSN=your-sentry-frontend-dsn-url
NODE_ENV=development  # or 'production'
```

## Sampling Rates

### Development
- Traces: 100% (all requests tracked)
- Profiles: 100% (all requests profiled)
- Session Replays: 100% on errors

### Production
- Traces: 10% (1 in 10 requests)
- Profiles: 10% (1 in 10 requests)
- Session Replays: 10% normal, 100% on errors

## Security Notes

- ⚠️ **Never commit** `.env` files with real DSN values
- ⚠️ DSN values are **public** (safe to expose in frontend)
- ⚠️ Debug routes are **disabled** in production
- ⚠️ Use environment variables for all sensitive config

## Troubleshooting

### "Debug routes not found"
- Check `NODE_ENV` is not set to `'production'`
- Restart backend server after changes

### "Errors not showing in Sentry"
- Verify DSN is correctly configured
- Check Sentry dashboard filters (environment, etc.)
- Trigger test error: `curl http://localhost:3001/api/debug/error`
- Check backend logs for Sentry initialization message

### "Frontend error button not visible"
- Button only shows in non-production environments
- Check `NODE_ENV` in browser console: `process.env.NODE_ENV`

## Additional Resources

- [Sentry Node.js Docs](https://docs.sentry.io/platforms/node/)
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Express Integration](https://docs.sentry.io/platforms/node/guides/express/)

---

**User Story 8 Complete:** ✅ Error tracking with Sentry SDK (Frontend + Backend)
