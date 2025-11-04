import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

/**
 * Progress Bar Demo/Test Component
 * 
 * This component demonstrates all the different progress bar types and features
 * for testing and documentation purposes.
 */

const ProgressBarDemo = () => {
  const [demoProgress, setDemoProgress] = useState(45);
  const [challenges, setChallenges] = useState({ total: 10, completed: 4 });
  const [goals, setGoals] = useState({ total: 5, completed: 2 });

  // Simulate progress updates
  const incrementProgress = () => {
    setDemoProgress(prev => Math.min(prev + 10, 100));
  };

  const decrementProgress = () => {
    setDemoProgress(prev => Math.max(prev - 10, 0));
  };

  const completeChallenge = () => {
    setChallenges(prev => ({
      ...prev,
      completed: Math.min(prev.completed + 1, prev.total)
    }));
  };

  const completeGoal = () => {
    setGoals(prev => ({
      ...prev,
      completed: Math.min(prev.completed + 1, prev.total)
    }));
  };

  // Calculate percentages
  const challengePercentage = challenges.total > 0 ? Math.round((challenges.completed / challenges.total) * 100) : 0;
  const goalPercentage = goals.total > 0 ? Math.round((goals.completed / goals.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Progress Bar Components Demo</h1>
          <p className="text-gray-600">
            Interactive demonstration of all progress bar variations with Recharts integration
          </p>
        </div>

        {/* Interactive Demo Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🎮 Interactive Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Manual Progress Control */}
            <div>
              <h3 className="font-semibold mb-3">Manual Progress</h3>
              <div className="space-y-3">
                <ProgressBar
                  percentage={demoProgress}
                  title="Demo Progress"
                  type="circular"
                  size="medium"
                  animated={true}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={decrementProgress}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    -10%
                  </button>
                  <button
                    onClick={incrementProgress}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </div>

            {/* Challenge Progress */}
            <div>
              <h3 className="font-semibold mb-3">Challenge Progress</h3>
              <div className="space-y-3">
                <ProgressBar
                  percentage={challengePercentage}
                  total={challenges.total}
                  completed={challenges.completed}
                  title="Challenges"
                  type="circular"
                  size="medium"
                  color="#3B82F6"
                />
                <button
                  onClick={completeChallenge}
                  disabled={challenges.completed >= challenges.total}
                  className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Challenge ({challenges.completed}/{challenges.total})
                </button>
              </div>
            </div>

            {/* Goal Progress */}
            <div>
              <h3 className="font-semibold mb-3">Goal Progress</h3>
              <div className="space-y-3">
                <ProgressBar
                  percentage={goalPercentage}
                  total={goals.total}
                  completed={goals.completed}
                  title="Goals"
                  type="circular"
                  size="medium"
                  color="#10B981"
                />
                <button
                  onClick={completeGoal}
                  disabled={goals.completed >= goals.total}
                  className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Goal ({goals.completed}/{goals.total})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Variations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">📈 Progress Bar Variations</h2>
          
          {/* Circular Progress - Different Sizes */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Circular Progress (Different Sizes)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="text-sm font-medium mb-2">Small</h4>
                <ProgressBar
                  percentage={75}
                  title="Small"
                  type="circular"
                  size="small"
                  color="#EF4444"
                />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-medium mb-2">Medium</h4>
                <ProgressBar
                  percentage={60}
                  title="Medium"
                  type="circular"
                  size="medium"
                  color="#F59E0B"
                />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-medium mb-2">Large</h4>
                <ProgressBar
                  percentage={85}
                  title="Large"
                  type="circular"
                  size="large"
                  color="#10B981"
                />
              </div>
            </div>
          </div>

          {/* Linear Progress */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Linear Progress</h3>
            <div className="space-y-4">
              <ProgressBar
                percentage={90}
                total={20}
                completed={18}
                title="Excellent Progress"
                type="linear"
                showStats={true}
                color="#10B981"
              />
              <ProgressBar
                percentage={65}
                total={15}
                completed={10}
                title="Good Progress"
                type="linear"
                showStats={true}
                color="#3B82F6"
              />
              <ProgressBar
                percentage={30}
                total={10}
                completed={3}
                title="Getting Started"
                type="linear"
                showStats={true}
                color="#F59E0B"
              />
            </div>
          </div>

          {/* Bar Chart Progress */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Bar Chart Progress</h3>
            <div className="space-y-4">
              <ProgressBar
                percentage={80}
                total={25}
                completed={20}
                title="Learning Goals"
                type="bar"
                showStats={true}
                color="#8B5CF6"
              />
              <ProgressBar
                percentage={45}
                total={20}
                completed={9}
                title="Skill Challenges"
                type="bar"
                showStats={true}
                color="#06B6D4"
              />
            </div>
          </div>

          {/* Mini Progress */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Mini Progress (Compact View)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ProgressBar percentage={95} type="mini" color="#10B981" />
              <ProgressBar percentage={78} type="mini" color="#3B82F6" />
              <ProgressBar percentage={52} type="mini" color="#F59E0B" />
              <ProgressBar percentage={23} type="mini" color="#EF4444" />
            </div>
          </div>

          {/* Color Variations */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Color Variations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <ProgressBar
                  percentage={92}
                  title="Excellent"
                  type="circular"
                  size="medium"
                  color="#10B981"
                />
                <p className="text-xs text-gray-600 mt-2">Green (90%+)</p>
              </div>
              <div className="text-center">
                <ProgressBar
                  percentage={75}
                  title="Good"
                  type="circular"
                  size="medium"
                  color="#3B82F6"
                />
                <p className="text-xs text-gray-600 mt-2">Blue (70-89%)</p>
              </div>
              <div className="text-center">
                <ProgressBar
                  percentage={55}
                  title="Fair"
                  type="circular"
                  size="medium"
                  color="#F59E0B"
                />
                <p className="text-xs text-gray-600 mt-2">Yellow (50-69%)</p>
              </div>
              <div className="text-center">
                <ProgressBar
                  percentage={35}
                  title="Needs Work"
                  type="circular"
                  size="medium"
                  color="#EF4444"
                />
                <p className="text-xs text-gray-600 mt-2">Red (25-49%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Demo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🎬 Animation Demo</h2>
          <p className="text-gray-600 mb-4">
            Click the buttons above to see smooth animations when progress values change!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressBar
              percentage={demoProgress}
              title="Animated Linear Progress"
              type="linear"
              animated={true}
              showStats={false}
            />
            <div className="flex justify-center">
              <ProgressBar
                percentage={demoProgress}
                title="Animated Circular"
                type="circular"
                size="medium"
                animated={true}
              />
            </div>
          </div>
        </div>

        {/* Usage Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">✨ Usage Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All progress bars automatically update with smooth animations</li>
            <li>• Colors change automatically based on progress percentage</li>
            <li>• Circular progress works best for overall/summary metrics</li>
            <li>• Linear progress is ideal for detailed breakdowns</li>
            <li>• Mini progress is perfect for dashboard widgets</li>
            <li>• Bar charts work well for comparative progress views</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ProgressBarDemo;