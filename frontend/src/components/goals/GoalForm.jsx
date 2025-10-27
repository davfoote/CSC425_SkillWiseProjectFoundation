// TODO: GoalForm component
import React from 'react';

export default function GoalForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
      <input name="title" placeholder="Goal title" />
      <button type="submit">Save</button>
    </form>
  );
}
