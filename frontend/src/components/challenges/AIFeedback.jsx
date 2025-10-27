// TODO: AIFeedback component
import React from 'react';

export default function AIFeedback({ feedback }) {
  return (
    <div>
      <h4>AI Feedback</h4>
      <pre>{feedback || 'No feedback yet'}</pre>
    </div>
  );
}
