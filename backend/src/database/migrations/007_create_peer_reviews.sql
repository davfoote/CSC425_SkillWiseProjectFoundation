-- TODO: create peer_reviews table
CREATE TABLE IF NOT EXISTS peer_reviews (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  score INTEGER,
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
