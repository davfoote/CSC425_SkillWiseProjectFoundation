/* eslint-env cypress */


describe('User Workflow: Complete Goal with Challenge', () => {
  const testUser = {
    firstName: 'E2E',
    lastName: 'Tester',
    email: `e2e-${Date.now()}@example.com`,
    password: 'E2ETest123',
  };

  const testGoal = {
    title: 'Master Full Stack Development',
    description: 'Learn React, Node.js, and database design',
    category: 'programming',
    difficulty: 'high',
    estimatedHours: 120,
  };

  beforeEach(() => {
    // Visit the application
    cy.visit('/');
  });

  it('should complete the full workflow: signup → login → create goal → start challenge → complete challenge', () => {
    // Step 1: User Registration
    cy.get('[data-testid="signup-link"]').should('be.visible').click();

    cy.get('[data-testid="signup-form"]').should('be.visible');
    cy.get('[data-testid="firstName-input"]').type(testUser.firstName);
    cy.get('[data-testid="lastName-input"]').type(testUser.lastName);
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="confirmPassword-input"]').type(testUser.password);

    cy.get('[data-testid="signup-button"]').click();

    // Verify registration success
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Account created successfully');

    // Step 2: User Login
    cy.get('[data-testid="login-link"]').click();

    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').clear().type(testUser.email);
    cy.get('[data-testid="password-input"]').clear().type(testUser.password);

    cy.get('[data-testid="login-button"]').click();

    // Verify login success and redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-greeting"]')
      .should('be.visible')
      .and('contain', testUser.firstName);

    // Step 3: Create Goal
    cy.get('[data-testid="create-goal-button"]').should('be.visible').click();

    cy.get('[data-testid="goal-form"]').should('be.visible');
    cy.get('[data-testid="goal-title-input"]').type(testGoal.title);
    cy.get('[data-testid="goal-description-input"]').type(testGoal.description);
    cy.get('[data-testid="goal-category-select"]').select(testGoal.category);
    cy.get('[data-testid="goal-difficulty-select"]').select(testGoal.difficulty);
    cy.get('[data-testid="goal-hours-input"]').type(testGoal.estimatedHours.toString());

    cy.get('[data-testid="create-goal-submit"]').click();

    // Verify goal creation
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Goal created successfully');

    cy.get('[data-testid="goal-list"]').should('contain', testGoal.title);
    cy.get('[data-testid="goal-item"]').first().should('contain', 'not_started');

    // Verify goal progress bar shows 0%
    cy.get('[data-testid="goal-progress-bar"]').first().should('be.visible');
    cy.get('[data-testid="goal-progress-text"]').first().should('contain', '0%');

    // Step 4: Browse and Start Challenge
    cy.get('[data-testid="challenges-nav"]').click();
    cy.url().should('include', '/challenges');

    // Filter challenges by programming category
    cy.get('[data-testid="category-filter"]').select('programming');

    // Select and view first programming challenge
    cy.get('[data-testid="challenge-card"]').first().click();
    cy.get('[data-testid="challenge-details"]').should('be.visible');

    // Start the challenge
    cy.get('[data-testid="start-challenge-button"]').click();

    // Verify challenge started
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Challenge started successfully');

    cy.get('[data-testid="challenge-status"]').should('contain', 'in_progress');
    cy.get('[data-testid="challenge-timer"]').should('be.visible');

    // Step 5: Complete Challenge
    cy.get('[data-testid="complete-challenge-button"]').should('be.visible').click();

    cy.get('[data-testid="submission-form"]').should('be.visible');
    cy.get('[data-testid="submission-url-input"]')
      .type('https://github.com/e2etester/fullstack-project');
    cy.get('[data-testid="submission-notes-input"]')
      .type('Completed full stack application with React frontend and Node.js backend');

    cy.get('[data-testid="submit-challenge-button"]').click();

    // Verify challenge completion
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Challenge completed successfully');

    cy.get('[data-testid="challenge-status"]').should('contain', 'completed');
    cy.get('[data-testid="points-earned"]').should('be.visible');

    // Step 6: Verify Goal Progress Updated
    cy.get('[data-testid="goals-nav"]').click();
    cy.url().should('include', '/goals');

    // Verify goal progress has increased from 0%
    cy.get('[data-testid="goal-progress-text"]').first().should('not.contain', '0%');
    cy.get('[data-testid="goal-progress-bar"]').first().should('have.attr', 'value').and('not.equal', '0');

    // Click on goal to view details
    cy.get('[data-testid="goal-item"]').first().click();
    cy.get('[data-testid="goal-details"]').should('be.visible');

    // Verify challenge appears in goal's completed challenges
    cy.get('[data-testid="completed-challenges"]').should('be.visible');
    cy.get('[data-testid="challenge-list-item"]').should('have.length.at.least', 1);

    // Step 7: Verify Statistics and Leaderboard
    cy.get('[data-testid="stats-nav"]').click();
    cy.url().should('include', '/stats');

    // Verify user statistics updated
    cy.get('[data-testid="total-points"]').should('not.contain', '0');
    cy.get('[data-testid="completed-challenges-count"]').should('contain', '1');
    cy.get('[data-testid="active-goals-count"]').should('contain', '1');

    // Check leaderboard position
    cy.get('[data-testid="leaderboard-nav"]').click();
    cy.url().should('include', '/leaderboard');

    cy.get('[data-testid="user-rank"]').should('be.visible');
    cy.get('[data-testid="leaderboard-entry"]').should('contain', testUser.firstName);
  });

  it('should handle goal completion when all challenges are finished', () => {
    // This test would verify that when a user completes all challenges
    // associated with a goal, the goal status changes to "completed"
    // and the progress bar shows 100%

    // Use existing user and create a simple goal with one challenge
    cy.login(testUser.email, testUser.password);

    // Create a goal with minimal requirements
    cy.createGoal({
      title: 'Simple Goal',
      description: 'Goal with one challenge',
      category: 'programming',
      difficulty: 'easy',
      estimatedHours: 10,
    });

    // Complete the only challenge associated with this goal
    cy.get('[data-testid="challenges-nav"]').click();
    cy.get('[data-testid="challenge-card"]').first().click();
    cy.get('[data-testid="start-challenge-button"]').click();

    cy.completeChallenge({
      submissionUrl: 'https://github.com/user/simple-project',
      notes: 'Completed simple project',
    });

    // Return to goals and verify completion
    cy.get('[data-testid="goals-nav"]').click();
    cy.get('[data-testid="goal-progress-text"]').first().should('contain', '100%');
    cy.get('[data-testid="goal-status"]').first().should('contain', 'completed');
  });

  it('should maintain progress across browser sessions', () => {
    // Test that user progress persists after logging out and back in
    cy.login(testUser.email, testUser.password);

    // Create goal and start challenge
    cy.createGoal(testGoal);
    cy.get('[data-testid="challenges-nav"]').click();
    cy.get('[data-testid="challenge-card"]').first().click();
    cy.get('[data-testid="start-challenge-button"]').click();

    // Log out
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/login');

    // Log back in
    cy.login(testUser.email, testUser.password);

    // Verify progress was maintained
    cy.get('[data-testid="challenges-nav"]').click();
    cy.get('[data-testid="my-challenges"]').click();
    cy.get('[data-testid="in-progress-challenges"]').should('have.length.at.least', 1);

    // Verify goal still exists
    cy.get('[data-testid="goals-nav"]').click();
    cy.get('[data-testid="goal-list"]').should('contain', testGoal.title);
  });

  afterEach(() => {
    // Clean up: attempt to delete test data if possible
    // Note: This would depend on having cleanup endpoints or test database reset
    cy.window().then((win) => {
      // Clear any local storage or session data
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });
});
