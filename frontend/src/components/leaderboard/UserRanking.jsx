// TODO: UserRanking component
import React from 'react';

export default function UserRanking({ user }) {
  return <div>User Ranking: {user?.id || 'N/A'}</div>;
}
