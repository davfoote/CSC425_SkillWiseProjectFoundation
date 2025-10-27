// TODO: GoalList component
import React from 'react';
import GoalCard from './GoalCard';

export default function GoalList({ goals = [] }) {
  return (
    <div>
      {goals.map((g) => (
        <GoalCard key={g.id} goal={g} />
      ))}
    </div>
  );
}
