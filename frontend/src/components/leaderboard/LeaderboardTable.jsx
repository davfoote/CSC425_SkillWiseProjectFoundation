// TODO: LeaderboardTable component
import React from 'react';

export default function LeaderboardTable({ rows = [] }) {
  return (
    <table>
      <thead>
        <tr><th>Rank</th><th>User</th><th>Points</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.user_id}><td>{r.rank}</td><td>{r.user_id}</td><td>{r.points}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
