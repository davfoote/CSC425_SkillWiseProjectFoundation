// TODO: MilestoneCard component
import React from 'react';

export default function MilestoneCard({ milestone }) {
  return (
    <div>
      <h4>{milestone?.title || 'Milestone'}</h4>
    </div>
  );
}
