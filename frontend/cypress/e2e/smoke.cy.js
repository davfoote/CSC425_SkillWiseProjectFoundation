// Simple Cypress smoke test (optional). Requires frontend and backend running and reachable.
describe('Smoke flow', () => {
  it('loads the app home page', () => {
    cy.visit('/');
    cy.contains('SkillWise').should('exist');
  });
});
