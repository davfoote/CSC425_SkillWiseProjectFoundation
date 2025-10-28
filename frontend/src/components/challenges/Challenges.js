import React from 'react';
import Navigation from '../layout/Navigation';

const Challenges = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Challenges</h1>
            <p className="text-gray-600 mb-8">
              Browse and complete challenges here. This page will be implemented in a future user story.
            </p>
            <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">
                Challenge browsing, creation, and completion functionality will be available soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Challenges;