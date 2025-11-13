import React from 'react';
import Navigation from '../layout/Navigation';

const DashboardShell = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's an overview of your learning journey.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">💪</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Challenges</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Streak</p>
                  <p className="text-2xl font-bold text-gray-900">0 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Goals Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    My Learning Goals
                  </h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200">
                    + New Goal
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Goals Placeholder */}
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start your learning journey by creating your first goal.
                    Goals help you structure and track your progress.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition duration-200">
                    Create Your First Goal
                  </button>
                </div>

                {/* Sample Goal Cards (hidden for now) */}
                <div className="hidden space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Learn JavaScript Basics</h4>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Master the fundamentals of JavaScript programming</p>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">65%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">💪</span>
                    Recent Challenges
                  </h2>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200">
                    Browse All
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Challenges Placeholder */}
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💪</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
                  <p className="text-gray-600 mb-6">
                    Challenges are hands-on exercises that help you practice and improve your skills.
                    Create goals first, then add challenges to them.
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition duration-200">
                    Explore Challenges
                  </button>
                </div>

                {/* Sample Challenge Cards (hidden for now) */}
                <div className="hidden space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Build a Todo App</h4>
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">In Progress</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Create a functional todo application using React</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Difficulty: Intermediate</span>
                      <span>Est. time: 2 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="text-2xl mr-3">📈</span>
                Recent Activity
              </h2>
            </div>

            <div className="p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to SkillWise!</h3>
                <p className="text-gray-600">
                  Your learning journey starts here. Create your first goal to begin tracking your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
