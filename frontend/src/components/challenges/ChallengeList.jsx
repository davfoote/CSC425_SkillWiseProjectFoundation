// TODO: ChallengeList component
import React from 'react';
import ChallengeCard from './ChallengeCard';

export default function ChallengeList({ challenges = [] }) {
  return (
    <div>
      {challenges.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  );
}
