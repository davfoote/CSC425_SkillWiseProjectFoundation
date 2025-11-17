import React, { useState } from 'react';
import './GenerateChallengeModal.css';

const GenerateChallengeModal = ({ isOpen, onClose, onChallengeGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedChallenge, setGeneratedChallenge] = useState(null);
  const [preferences, setPreferences] = useState({
    difficulty: 'medium',
    category: 'algorithms',
    language: 'JavaScript',
    topic: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');
      setGeneratedChallenge(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/ai/generateChallenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate challenge');
      }

      if (data.success && data.challenge) {
        setGeneratedChallenge(data.challenge);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error generating challenge:', err);
      setError(err.message || 'Failed to generate challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = () => {
    if (generatedChallenge && onChallengeGenerated) {
      onChallengeGenerated(generatedChallenge);
      handleClose();
    }
  };

  const handleClose = () => {
    setGeneratedChallenge(null);
    setError('');
    setPreferences({
      difficulty: 'medium',
      category: 'algorithms',
      language: 'JavaScript',
      topic: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🤖 Generate AI Challenge</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {!generatedChallenge ? (
            <div className="preferences-form">
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={preferences.difficulty}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={preferences.category}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="algorithms">Algorithms</option>
                  <option value="data-structures">Data Structures</option>
                  <option value="web-development">Web Development</option>
                  <option value="databases">Databases</option>
                  <option value="problem-solving">Problem Solving</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">Programming Language</label>
                <select
                  id="language"
                  name="language"
                  value={preferences.language}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="TypeScript">TypeScript</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="topic">Specific Topic (Optional)</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={preferences.topic}
                  onChange={handleInputChange}
                  placeholder="e.g., binary trees, recursion, arrays..."
                  disabled={loading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? '🔄 Generating...' : '✨ Generate Challenge'}
              </button>
            </div>
          ) : (
            <div className="challenge-preview">
              <div className="challenge-header">
                <h3>{generatedChallenge.title}</h3>
                <div className="challenge-badges">
                  <span className={`difficulty-badge ${generatedChallenge.difficulty}`}>
                    {generatedChallenge.difficulty}
                  </span>
                  <span className="category-badge">{generatedChallenge.category}</span>
                  <span className="points-badge">
                    {generatedChallenge.pointValue} points
                  </span>
                </div>
              </div>

              <div className="challenge-description">
                <h4>Description</h4>
                <p>{generatedChallenge.description}</p>
              </div>

              {generatedChallenge.exampleInput && (
                <div className="challenge-examples">
                  <h4>Example</h4>
                  <div className="example-box">
                    <strong>Input:</strong>
                    <pre>{generatedChallenge.exampleInput}</pre>
                    <strong>Output:</strong>
                    <pre>{generatedChallenge.exampleOutput}</pre>
                  </div>
                </div>
              )}

              {generatedChallenge.constraints && (
                <div className="challenge-constraints">
                  <h4>Constraints</h4>
                  <p>{generatedChallenge.constraints}</p>
                </div>
              )}

              {generatedChallenge.hints && generatedChallenge.hints.length > 0 && (
                <div className="challenge-hints">
                  <h4>Hints</h4>
                  <ul>
                    {generatedChallenge.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-actions">
                <button className="secondary-button" onClick={() => setGeneratedChallenge(null)}>
                  ← Generate Another
                </button>
                <button className="primary-button" onClick={handleAcceptChallenge}>
                  ✓ Use This Challenge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateChallengeModal;
