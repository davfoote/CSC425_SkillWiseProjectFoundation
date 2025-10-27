// TODO: ChallengeForm component
import React from 'react';

export default function ChallengeForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
      <input name="title" placeholder="Challenge title" />
      <button type="submit">Create</button>
    </form>
  );
}
