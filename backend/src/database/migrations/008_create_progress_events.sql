-- TODO: create progress events table
CREATE TABLE IF NOT EXISTS progress_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
  event_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
