// TODO: GoalDetails component
import React from 'react';

export default function GoalDetails({ goal }) {
  return (
    <div>
      <h2>{goal?.title || 'Goal Title'}</h2>
      <p>Details (placeholder)</p>
    </div>
  );
}
