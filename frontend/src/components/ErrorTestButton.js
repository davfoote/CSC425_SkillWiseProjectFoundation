import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import './ErrorTestButton.css';

/**
 * ErrorTestButton Component
 * 
 * Testing component for Sentry error tracking.
 * Only rendered in development/test environments.
 * Provides buttons to trigger various types of errors.
 */
const ErrorTestButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const triggerError = () => {
    throw new Error('Test error triggered from ErrorTestButton component');
  };

  const triggerAsyncError = async () => {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Test async error from ErrorTestButton'));
        }, 100);
      });
    } catch (error) {
      throw error;
    }
  };

  const triggerSentryMessage = () => {
    Sentry.captureMessage('Test message from frontend ErrorTestButton', 'info');
    alert('Test message sent to Sentry!');
  };

  const triggerSentryException = () => {
    const error = new Error('Test Sentry exception from frontend');
    error.customData = {
      userId: 'test-user-123',
      component: 'ErrorTestButton',
      timestamp: new Date().toISOString(),
    };
    Sentry.captureException(error);
    alert('Test exception captured by Sentry!');
  };

  const triggerNetworkError = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/debug/error', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backend error: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          errorType: 'network',
          endpoint: '/api/debug/error',
        },
      });
      alert(`Network error captured: ${error.message}`);
    }
  };

  return (
    <div className="error-test-button-container">
      <button
        className="error-test-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Error Testing Tools (Dev Only)"
      >
        🐛 Error Tests
      </button>

      {isOpen && (
        <div className="error-test-panel">
          <div className="error-test-header">
            <h3>🔧 Error Testing Panel</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="error-test-buttons">
            <button onClick={triggerError} className="error-btn error-btn-danger">
              Throw Sync Error
            </button>

            <button onClick={triggerAsyncError} className="error-btn error-btn-danger">
              Throw Async Error
            </button>

            <button onClick={triggerSentryMessage} className="error-btn error-btn-info">
              Send Sentry Message
            </button>

            <button onClick={triggerSentryException} className="error-btn error-btn-warning">
              Capture Exception
            </button>

            <button onClick={triggerNetworkError} className="error-btn error-btn-warning">
              Trigger Backend Error
            </button>
          </div>

          <div className="error-test-info">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Sentry Enabled:</strong> {process.env.REACT_APP_SENTRY_DSN ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorTestButton;
