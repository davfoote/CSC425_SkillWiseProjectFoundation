// TODO: ReviewList component
import React from 'react';
import ReviewCard from './ReviewCard';

export default function ReviewList({ reviews = [] }) {
  return (
    <div>
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}
