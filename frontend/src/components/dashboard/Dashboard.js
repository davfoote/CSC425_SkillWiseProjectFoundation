import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Redirect to login (in a real app, you'd use React Router)
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">SkillWise Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.firstName} {user.lastName}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg min-h-96">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Learning Journey!</h2>

              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="text-lg text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Set Goals</h4>
                  <p className="text-gray-600 mb-4">Define your learning objectives</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Create Goal
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl mb-2">💪</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Take Challenges</h4>
                  <p className="text-gray-600 mb-4">Test your skills with AI-powered challenges</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Browse Challenges
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h4>
                  <p className="text-gray-600 mb-4">Monitor your learning journey</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🌟</div>
                  <p className="text-gray-600">Welcome to SkillWise! Start your learning journey by setting your first goal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
