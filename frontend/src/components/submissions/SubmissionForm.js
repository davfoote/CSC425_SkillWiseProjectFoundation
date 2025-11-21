import React, { useState } from 'react';
import Navigation from '../layout/Navigation';
import aiService from '../../services/aiService';

const SubmissionForm = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback(null);

    if (!text && !file) {
      setError('Please provide text or upload a file to submit.');
      return;
    }

    setLoading(true);
    try {
      const resp = await aiService.submitForFeedback({ text, file });
      // Attempt to read common response shapes
      if (resp.feedback) setFeedback(resp.feedback);
      else if (resp.result) setFeedback(resp.result);
      else setFeedback(resp);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Submit for AI Feedback</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Paste your work</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste code, essay, or any text you'd like feedback on"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Or upload a file</label>
            <input type="file" onChange={handleFileChange} className="mt-1" />
            {file && <div className="text-sm text-gray-600 mt-1">Selected file: {file.name}</div>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700">{error}</div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Submitting...' : 'Submit for Feedback'}
            </button>
          </div>
        </form>

        {feedback && (
          <div className="mt-6 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">AI Feedback</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{typeof feedback === 'string' ? feedback : JSON.stringify(feedback, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmissionForm;
