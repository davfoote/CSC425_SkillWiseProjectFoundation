-- TODO: create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rank INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
