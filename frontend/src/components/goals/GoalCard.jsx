// TODO: GoalCard component
import React from 'react';

export default function GoalCard({ goal }) {
  return (
    <article>
      <h3>{goal?.title || 'Goal title'}</h3>
    </article>
  );
}
