import React from 'react';

const GenerateChallengeModal = ({ isOpen, onClose, generated, loading, error, onRegenerate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generated Challenge</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✖</button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating challenge...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && generated && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Title</h4>
                <p className="text-gray-900">{generated.title || generated.name || generated.challengeTitle || 'Untitled Challenge'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="text-gray-900 whitespace-pre-line">{generated.description || generated.prompt || generated.details || 'No description provided.'}</p>
              </div>

              {generated.examples && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Examples</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(generated.examples, null, 2)}</pre>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button onClick={onRegenerate} className="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Regenerate</button>
                <button onClick={onClose} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
              </div>
            </div>
          )}

          {!loading && !error && !generated && (
            <div className="text-center py-8">
              <p className="text-gray-600">No challenge generated yet.</p>
              <div className="mt-4 flex justify-center">
                <button onClick={onRegenerate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Generate</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateChallengeModal;
