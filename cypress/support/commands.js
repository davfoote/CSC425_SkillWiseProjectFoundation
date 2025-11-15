/* eslint-env cypress */


// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-button]').click();
});

// Custom command for registration
Cypress.Commands.add('register', (firstName, lastName, email, password) => {
  cy.visit('/register');
  cy.get('[data-testid=firstname-input]').type(firstName);
  cy.get('[data-testid=lastname-input]').type(lastName);
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=register-button]').click();
});

// Custom command for creating a goal
Cypress.Commands.add('createGoal', (title, description, targetDate) => {
  cy.visit('/goals');
  cy.get('[data-testid=create-goal-button]').click();
  cy.get('[data-testid=goal-title-input]').type(title);
  cy.get('[data-testid=goal-description-input]').type(description);
  if (targetDate) {
    cy.get('[data-testid=goal-date-input]').type(targetDate);
  }
  cy.get('[data-testid=save-goal-button]').click();
});

// Custom command for creating a challenge
Cypress.Commands.add('createChallenge', (title, description, difficulty) => {
  cy.visit('/challenges');
  cy.get('[data-testid=create-challenge-button]').click();
  cy.get('[data-testid=challenge-title-input]').type(title);
  cy.get('[data-testid=challenge-description-input]').type(description);
  if (difficulty) {
    cy.get('[data-testid=challenge-difficulty-select]').select(difficulty);
  }
  cy.get('[data-testid=save-challenge-button]').click();
});

// Custom command for marking challenge as complete
Cypress.Commands.add('completeChallenge', (challengeTitle) => {
  cy.visit('/challenges');
  cy.contains('[data-testid=challenge-card]', challengeTitle)
    .find('[data-testid=complete-button]')
    .click();
});

// Custom command for checking progress
Cypress.Commands.add('checkProgress', (expectedPercentage) => {
  cy.visit('/progress');
  cy.get('[data-testid=progress-percentage]').should('contain', expectedPercentage);
});
