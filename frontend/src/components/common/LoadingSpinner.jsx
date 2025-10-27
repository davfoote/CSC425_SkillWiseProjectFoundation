// TODO: Replace svg color and add CSS animations
import React from 'react';

const LoadingSpinner = ({ size = 40, label = 'Loading' }) => {
  const s = typeof size === 'number' ? `${size}px` : size;
  return (
    <div role="status" aria-live="polite" className="loading-spinner" style={{ width: s, height: s }}>
      <svg viewBox="0 0 50 50" className="spinner-svg" aria-hidden="true" width={s} height={s}>
        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#3b82f6" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
