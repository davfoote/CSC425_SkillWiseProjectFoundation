import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

/**
 * ProgressBar Component using Recharts
 *
 * Displays completion percentage in multiple visual formats:
 * - Circular progress (pie chart)
 * - Linear progress bar
 * - Animated progress with smooth transitions
 */

const ProgressBar = ({
  percentage = 0,
  total = 0,
  completed = 0,
  title = 'Progress',
  type = 'circular', // "circular" | "linear" | "mini"
  size = 'medium', // "small" | "medium" | "large"
  showStats = true,
  animated = true,
  color = '#3B82F6', // Default blue color
}) => {

  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Color scheme based on progress
  const getProgressColor = (percent) => {
    if (percent >= 90) return '#10B981'; // Green - Excellent
    if (percent >= 70) return '#3B82F6'; // Blue - Good
    if (percent >= 50) return '#F59E0B'; // Yellow - Fair
    if (percent >= 25) return '#EF4444'; // Red - Needs Work
    return '#6B7280'; // Gray - Just Started
  };

  const progressColor = color === '#3B82F6' ? getProgressColor(normalizedPercentage) : color;

  // Data for circular progress (pie chart)
  const circularData = [
    { name: 'Completed', value: normalizedPercentage, color: progressColor },
    { name: 'Remaining', value: 100 - normalizedPercentage, color: '#E5E7EB' },
  ];

  // Data for bar chart version
  const barData = [
    {
      name: 'Progress',
      completed: normalizedPercentage,
      remaining: 100 - normalizedPercentage,
    },
  ];

  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 80, fontSize: 'text-sm', padding: 'p-2' },
    medium: { width: 120, height: 120, fontSize: 'text-base', padding: 'p-4' },
    large: { width: 200, height: 200, fontSize: 'text-lg', padding: 'p-6' },
  };

  const config = sizeConfig[size];

  // Circular Progress Component
  const CircularProgress = () => (
    <div className={`relative ${config.padding}`}>
      <ResponsiveContainer width={config.width} height={config.height}>
        <PieChart>
          <Pie
            data={circularData}
            cx="50%"
            cy="50%"
            innerRadius={size === 'small' ? 25 : size === 'medium' ? 35 : 60}
            outerRadius={size === 'small' ? 35 : size === 'medium' ? 50 : 85}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            animationBegin={0}
            animationDuration={animated ? 1000 : 0}
          >
            {circularData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`font-bold ${config.fontSize}`} style={{ color: progressColor }}>
            {normalizedPercentage}%
          </div>
          {size !== 'small' && (
            <div className="text-xs text-gray-600">
              {title}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Linear Progress Component
  const LinearProgress = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium text-gray-700 ${config.fontSize}`}>{title}</span>
        <span className={`font-bold ${config.fontSize}`} style={{ color: progressColor }}>
          {normalizedPercentage}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${normalizedPercentage}%`,
            backgroundColor: progressColor,
            transition: animated ? 'width 1s ease-out' : 'none',
          }}
        />
      </div>

      {showStats && (
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Completed: {completed}</span>
          <span>Total: {total}</span>
        </div>
      )}
    </div>
  );

  // Mini Progress Component (compact version)
  const MiniProgress = () => (
    <div className="flex items-center space-x-2">
      <div className="w-16 bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${normalizedPercentage}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>
      <span className="text-sm font-medium" style={{ color: progressColor }}>
        {normalizedPercentage}%
      </span>
    </div>
  );

  // Bar Chart Progress Component
  const BarProgress = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium text-gray-700 ${config.fontSize}`}>{title}</span>
        <span className={`font-bold ${config.fontSize}`} style={{ color: progressColor }}>
          {normalizedPercentage}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={barData} layout="horizontal">
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            formatter={(value, name) => [
              `${value}%`,
              name === 'completed' ? 'Completed' : 'Remaining',
            ]}
          />
          <Bar dataKey="completed" stackId="a" fill={progressColor} radius={[4, 0, 0, 4]} />
          <Bar dataKey="remaining" stackId="a" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {showStats && (
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Completed: {completed}</span>
          <span>Total: {total}</span>
        </div>
      )}
    </div>
  );

  // Render appropriate progress type
  switch (type) {
  case 'circular':
    return CircularProgress();
  case 'linear':
    return LinearProgress();
  case 'mini':
    return MiniProgress();
  case 'bar':
    return BarProgress();
  default:
    return CircularProgress();
  }
};

export default ProgressBar;
