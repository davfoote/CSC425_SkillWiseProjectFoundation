// TODO: ReviewCard component
import React from 'react';

export default function ReviewCard({ review }) {
  return (
    <div>
      <h4>Review by {review?.reviewer_id || 'N/A'}</h4>
      <p>{review?.comments || 'No comments'}</p>
    </div>
  );
}
