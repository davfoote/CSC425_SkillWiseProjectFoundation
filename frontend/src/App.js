import React from 'react';
import './App.css';
import SignupForm from './components/auth/SignupForm';

function App() {
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to SkillWise
            </h1>
            <p className="text-lg text-gray-600">
              Your AI-powered learning platform
            </p>
          </div>
          
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default App;
