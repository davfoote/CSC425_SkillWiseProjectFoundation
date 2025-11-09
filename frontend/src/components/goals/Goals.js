import React, { useState } from 'react';
import Navigation from '../layout/Navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Goals = () => {
  const { token, addGoal, goals } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const resp = await axios.post('/api/goals', data, { headers });

      // backend may return created goal in resp.data; fall back to form data
      const created = resp?.data?.goal || resp?.data || { id: Date.now(), ...data };

      // add to client state
      addGoal(created);
      setSuccessMessage('Goal created successfully.');
      reset();
    } catch (err) {
      console.error('Create goal failed', err);
      setServerError(err?.response?.data?.message || err.message || 'Failed to create goal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-6">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create a Learning Goal</h1>
            <p className="text-gray-600 mb-6">Define a learning objective and track your progress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Learn React Hooks"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register('description')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    placeholder="Describe what you want to achieve"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    {...register('targetDate')}
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {serverError && <p className="text-red-600 text-sm mb-3">{serverError}</p>}
                {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>

            <div className="">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h3>
                {goals && goals.length > 0 ? (
                  <ul className="space-y-4">
                    {goals.map((g) => (
                      <li key={g.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-md font-semibold text-gray-900">{g.title}</h4>
                            <p className="text-sm text-gray-600">{g.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {g.targetDate ? new Date(g.targetDate).toLocaleDateString() : ''}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-600">No goals yet — create your first goal.</div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Make goals specific and measurable.</li>
                  <li>Set a realistic target date.</li>
                  <li>Break large goals into smaller milestones.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Goals;