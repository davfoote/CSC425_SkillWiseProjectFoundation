-- TODO: create ai_feedback table
CREATE TABLE IF NOT EXISTS ai_feedback (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
