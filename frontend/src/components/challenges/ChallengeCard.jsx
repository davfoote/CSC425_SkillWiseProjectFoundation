// TODO: ChallengeCard component
import React from 'react';

export default function ChallengeCard({ challenge }) {
  return (
    <div>
      <h4>{challenge?.title || 'Challenge'}</h4>
    </div>
  );
}
