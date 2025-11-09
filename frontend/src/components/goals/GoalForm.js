import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../api/axiosInstance';

const GoalForm = ({ onCreated }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Normalize date field name to backend expected name
      const payload = {
        title: data.title,
        description: data.description,
        target_completion_date: data.target_completion_date,
        difficulty_level: data.difficulty_level || 'medium'
      };
  const res = await axios.post('/goals', payload);
      onCreated && onCreated(res.data.data);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create a new goal</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input {...register('title', { required: true })} className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea {...register('description')} className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target date</label>
          <input type="date" {...register('target_completion_date')} className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select {...register('difficulty_level')} className="mt-1 block w-full border rounded p-2">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {loading ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
