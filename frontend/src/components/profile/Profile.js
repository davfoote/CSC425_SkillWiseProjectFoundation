import React from 'react';
import Navigation from '../layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
            
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mr-6">
                  <span className="text-white text-2xl font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Name</label>
                      <p className="text-gray-900">{user?.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Name</label>
                      <p className="text-gray-900">{user?.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Goals</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Challenges</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-medium">0 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Points</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                <p className="text-gray-600 mb-4">
                  Profile editing and settings will be available in a future update.
                </p>
                <button 
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                  disabled
                >
                  Edit Profile (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;