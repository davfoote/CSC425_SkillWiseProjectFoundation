import React from 'react';

const ProgressBar = ({ percent = 0 }) => {
  const p = Math.max(0, Math.min(100, Number(percent || 0)));
  return (
    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
      <div className="h-full bg-indigo-600" style={{ width: `${p}%` }} />
    </div>
  );
};

export default ProgressBar;
