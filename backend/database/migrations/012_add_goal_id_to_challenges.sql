-- Migration: Add goal_id column to challenges
ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS goal_id INTEGER REFERENCES goals(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_challenges_goal_id ON challenges(goal_id);

-- Note: Ensure the goals table exists before running this migration.
