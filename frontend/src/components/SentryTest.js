import React from 'react';

const SentryTest = () => {
  const throwError = () => {
    throw new Error('Sentry test error - frontend');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sentry Test</h2>
      <p className="mb-4">Click the button to trigger a test error that Sentry should capture.</p>
      <button onClick={throwError} className="px-4 py-2 bg-red-600 text-white rounded">Trigger Error</button>
    </div>
  );
};

export default SentryTest;
