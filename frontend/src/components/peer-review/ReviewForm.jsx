// TODO: ReviewForm component
import React from 'react';

export default function ReviewForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
      <textarea name="comments" placeholder="Write feedback" />
      <button type="submit">Submit Review</button>
    </form>
  );
}
