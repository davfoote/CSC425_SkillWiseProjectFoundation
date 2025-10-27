// TODO: ChallengeSubmission component
import React from 'react';

export default function ChallengeSubmission({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
      <textarea name="submission" placeholder="Your work" />
      <button type="submit">Submit</button>
    </form>
  );
}
