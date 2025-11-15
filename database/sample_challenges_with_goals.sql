-- Insert sample challenges with goal relationships for User Story 5 testing
-- Note: These challenges can be linked to goals or created as standalone challenges

-- First, let's create some sample goals to link challenges to
-- (Assuming user with ID 2 exists from previous testing)

INSERT INTO goals (
  user_id, 
  title, 
  description, 
  category, 
  difficulty_level, 
  target_completion_date,
  created_at, 
  updated_at
) VALUES 
-- Goal 1: Frontend Development
(2, 'Master Frontend Development', 'Learn modern frontend technologies including React, CSS, and responsive design', 'Frontend', 'medium', '2025-12-31', NOW(), NOW()),

-- Goal 2: Backend Development  
(2, 'Backend API Development', 'Master backend development with Node.js, databases, and API design', 'Backend', 'hard', '2025-11-30', NOW(), NOW()),

-- Goal 3: Programming Fundamentals
(2, 'Programming Fundamentals', 'Build strong foundation in programming concepts and best practices', 'Programming', 'easy', '2025-10-31', NOW(), NOW());

-- Now insert challenges linked to these goals
INSERT INTO challenges (
  goal_id,
  created_by,
  title, 
  description, 
  instructions,
  category, 
  difficulty_level, 
  estimated_time_minutes,
  points_reward,
  max_attempts,
  requires_peer_review,
  is_active,
  tags,
  prerequisites,
  learning_objectives,
  updated_at
) VALUES 
-- Challenges for Frontend Development Goal (goal_id = 1)
(
  1, -- Linked to "Master Frontend Development" goal
  2, -- Created by user 2
  'React Component Architecture',
  'Learn to build scalable React applications with proper component architecture and state management.',
  'Create a complete React application that demonstrates component composition, state lifting, and hook usage. Include error boundaries and performance optimizations.',
  'Frontend',
  'medium',
  120,
  150,
  3,
  true,
  ARRAY['react', 'components', 'hooks', 'state-management'],
  ARRAY['JavaScript fundamentals', 'ES6+ syntax'],
  ARRAY['Design reusable components', 'Implement state management', 'Apply React best practices'],
  NOW()
),
(
  1, -- Linked to "Master Frontend Development" goal
  2,
  'CSS Grid & Flexbox Mastery',
  'Master modern CSS layout techniques using Grid and Flexbox for responsive design.',
  'Build a responsive website layout using CSS Grid for page structure and Flexbox for component layouts. Ensure mobile-first design principles.',
  'Frontend', 
  'easy',
  90,
  100,
  3,
  false,
  ARRAY['css', 'grid', 'flexbox', 'responsive'],
  ARRAY['Basic HTML/CSS knowledge'],
  ARRAY['Master CSS Grid layouts', 'Understand Flexbox patterns', 'Create responsive designs'],
  NOW()
),

-- Challenges for Backend Development Goal (goal_id = 2)  
(
  2, -- Linked to "Backend API Development" goal
  2,
  'RESTful API Design',
  'Design and implement a complete RESTful API with proper HTTP methods, status codes, and error handling.',
  'Create a RESTful API for a task management system. Implement CRUD operations, proper HTTP status codes, request validation, and comprehensive error handling.',
  'Backend',
  'medium',
  150,
  200,
  2,
  true,
  ARRAY['api', 'rest', 'http', 'nodejs'],
  ARRAY['JavaScript/Node.js basics', 'Database fundamentals'],
  ARRAY['Design RESTful endpoints', 'Implement proper HTTP patterns', 'Handle errors gracefully'],
  NOW()
),
(
  2, -- Linked to "Backend API Development" goal  
  2,
  'Database Optimization Techniques',
  'Learn advanced database optimization including indexing, query optimization, and performance monitoring.',
  'Analyze and optimize slow database queries, create appropriate indexes, and implement query performance monitoring. Document optimization strategies.',
  'Backend',
  'hard',
  180,
  250,
  2,
  true,
  ARRAY['database', 'postgresql', 'optimization', 'indexing'],
  ARRAY['SQL fundamentals', 'Database design basics'],
  ARRAY['Optimize query performance', 'Design effective indexes', 'Monitor database performance'],
  NOW()
),

-- Challenges for Programming Fundamentals Goal (goal_id = 3)
(
  3, -- Linked to "Programming Fundamentals" goal
  2,
  'Algorithm Implementation',
  'Implement fundamental algorithms and understand their time and space complexity.',
  'Implement sorting algorithms (quicksort, mergesort), search algorithms (binary search), and analyze their Big O complexity. Include unit tests.',
  'Programming',
  'medium',
  120,
  175,
  3,
  false,
  ARRAY['algorithms', 'complexity', 'sorting', 'searching'],
  ARRAY['Basic programming knowledge', 'Mathematical thinking'],
  ARRAY['Implement core algorithms', 'Analyze time complexity', 'Write efficient code'],
  NOW()
),
(
  3, -- Linked to "Programming Fundamentals" goal
  2,
  'Test-Driven Development',
  'Learn TDD methodology by writing tests first, then implementing functionality.',
  'Practice TDD by building a calculator library. Write comprehensive unit tests first, then implement the functionality to make tests pass.',
  'Programming',
  'easy',
  75,
  125,
  3,
  false,
  ARRAY['tdd', 'testing', 'unit-tests', 'best-practices'],
  ARRAY['Basic programming syntax'],
  ARRAY['Write tests before code', 'Understand TDD cycle', 'Create maintainable tests'],
  NOW()
),

-- Standalone Challenges (not linked to specific goals - goal_id = NULL)
(
  NULL, -- Standalone challenge
  2,
  'Git Version Control Mastery', 
  'Master Git version control with advanced branching, merging, and collaboration workflows.',
  'Demonstrate proficiency with Git by managing a multi-developer project simulation. Use feature branches, handle merge conflicts, and implement proper commit strategies.',
  'DevOps',
  'easy',
  60,
  100,
  3,
  false,
  ARRAY['git', 'version-control', 'collaboration', 'workflow'],
  ARRAY['Basic command line knowledge'],
  ARRAY['Master Git workflows', 'Handle merge conflicts', 'Collaborate effectively'],
  NOW()
),
(
  NULL, -- Standalone challenge
  2,
  'Docker Containerization',
  'Learn containerization with Docker for application deployment and development environments.',
  'Containerize a full-stack application using Docker. Create efficient Dockerfiles, use Docker Compose for multi-container setup, and implement best practices.',
  'DevOps',
  'hard',
  200,
  300,
  2,
  true,
  ARRAY['docker', 'containers', 'deployment', 'devops'],
  ARRAY['Linux basics', 'Application deployment knowledge'],
  ARRAY['Create Docker containers', 'Use Docker Compose', 'Implement container best practices'],
  NOW()
);