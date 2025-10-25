-- TODO: create user_statistics table
CREATE TABLE IF NOT EXISTS user_statistics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
