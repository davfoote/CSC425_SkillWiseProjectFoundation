-- TODO: create progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
  percent_complete NUMERIC DEFAULT 0,
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
