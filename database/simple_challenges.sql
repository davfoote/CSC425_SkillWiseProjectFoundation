-- Insert sample challenges for User Story 5 testing (simplified version)
-- Insert challenges one by one to avoid array syntax issues

-- First, create a test goal
INSERT INTO goals (user_id, title, description, category, difficulty_level, target_completion_date, updated_at)
VALUES (2, 'Frontend Mastery', 'Master frontend development skills', 'Frontend', 'medium', '2025-12-31', NOW());

-- Get the goal ID and insert challenges linked to it
-- Challenge 1: Linked to goal
INSERT INTO challenges (
  goal_id, created_by, title, description, instructions, category, 
  difficulty_level, estimated_time_minutes, points_reward, max_attempts,
  requires_peer_review, is_active, updated_at
) VALUES (
  1, 2, 'React Component Design',
  'Build reusable React components with proper state management.',
  'Create functional components that demonstrate hooks and component patterns.',
  'Frontend', 'medium', 90, 100, 3, true, true, NOW()
);

-- Challenge 2: Standalone (no goal link)
INSERT INTO challenges (
  created_by, title, description, instructions, category,
  difficulty_level, estimated_time_minutes, points_reward, max_attempts,
  requires_peer_review, is_active, updated_at
) VALUES (
  2, 'Git Workflow Mastery',
  'Master Git version control with advanced branching strategies.',
  'Practice Git workflows including feature branches and merge conflicts.',
  'DevOps', 'easy', 60, 75, 3, false, true, NOW()
);

-- Challenge 3: Linked to goal
INSERT INTO challenges (
  goal_id, created_by, title, description, instructions, category,
  difficulty_level, estimated_time_minutes, points_reward, max_attempts, 
  requires_peer_review, is_active, updated_at
) VALUES (
  1, 2, 'CSS Grid Layout',
  'Master CSS Grid for creating responsive layouts.',
  'Build responsive layouts using CSS Grid and Flexbox.',
  'Frontend', 'easy', 75, 85, 3, false, true, NOW()
);