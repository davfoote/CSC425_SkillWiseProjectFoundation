// Submission form component for challenge solutions
import React, { useState } from 'react';
import './SubmissionForm.css';

const SubmissionForm = ({ challenge, onSubmit, onCancel }) => {
  const [submissionMethod, setSubmissionMethod] = useState('text'); // 'text' or 'file'
  const [codeText, setCodeText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (only code files)
      const validExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rb', '.php'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setError('Please upload a valid code file (.js, .py, .java, etc.)');
        return;
      }

      if (file.size > 1024 * 1024) { // 1MB limit
        setError('File size must be less than 1MB');
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
      setError('');

      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        setCodeText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!codeText.trim()) {
      setError('Please provide your code solution');
      return;
    }

    if (codeText.trim().length < 10) {
      setError('Code solution seems too short');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/ai/submitForFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          challengeDescription: challenge.description,
          codeSubmission: codeText,
          language: challenge.language || 'JavaScript',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit for feedback');
      }

      const data = await response.json();
      
      // Call parent callback with submission data
      if (onSubmit) {
        onSubmit(data);
      }

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit code for feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCodeText('');
    setSelectedFile(null);
    setFileName('');
    setError('');
  };

  return (
    <div className="submission-form-overlay">
      <div className="submission-form-container">
        <div className="submission-form-header">
          <h2>Submit Your Solution</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="challenge-info">
          <h3>{challenge.title}</h3>
          <span className={`difficulty-badge ${challenge.difficulty}`}>
            {challenge.difficulty}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="submission-form">
          {/* Submission method toggle */}
          <div className="submission-method">
            <label>
              <input
                type="radio"
                value="text"
                checked={submissionMethod === 'text'}
                onChange={(e) => setSubmissionMethod(e.target.value)}
              />
              <span>Type/Paste Code</span>
            </label>
            <label>
              <input
                type="radio"
                value="file"
                checked={submissionMethod === 'file'}
                onChange={(e) => setSubmissionMethod(e.target.value)}
              />
              <span>Upload File</span>
            </label>
          </div>

          {/* Text area for typing/pasting code */}
          {submissionMethod === 'text' && (
            <div className="form-group">
              <label htmlFor="codeText">Your Code Solution</label>
              <textarea
                id="codeText"
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                placeholder="Paste your code here..."
                rows={15}
                className="code-textarea"
                spellCheck={false}
              />
              <div className="char-count">
                {codeText.length} characters
              </div>
            </div>
          )}

          {/* File upload input */}
          {submissionMethod === 'file' && (
            <div className="form-group">
              <label htmlFor="fileUpload">Upload Code File</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php"
                  className="file-input"
                />
                <label htmlFor="fileUpload" className="file-upload-label">
                  📁 {fileName || 'Choose file...'}
                </label>
              </div>
              {selectedFile && (
                <div className="file-info">
                  ✓ Selected: {fileName} ({Math.round(selectedFile.size / 1024)}KB)
                </div>
              )}
              {codeText && submissionMethod === 'file' && (
                <div className="code-preview">
                  <div className="code-preview-header">File Preview:</div>
                  <pre className="code-preview-content">{codeText.substring(0, 500)}...</pre>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary"
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !codeText.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Getting Feedback...
                </>
              ) : (
                <>🤖 Submit for AI Feedback</>
              )}
            </button>
          </div>
        </form>

        {/* Info footer */}
        <div className="submission-info">
          <p>💡 Your code will be analyzed by AI to provide constructive feedback on:</p>
          <ul>
            <li>Correctness and functionality</li>
            <li>Code quality and style</li>
            <li>Performance optimization</li>
            <li>Best practices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;
