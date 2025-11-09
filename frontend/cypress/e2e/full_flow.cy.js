describe('Full user flow: signup → create goal → add challenge → mark complete', () => {
  const apiBase = 'http://localhost:3001/api';

  it('signup, login, create goal, create challenge, mark goal complete', () => {
    const unique = Date.now();
    const email = `test+${unique}@example.com`;
    const password = 'Password123!';

    // Signup via API
    cy.request('POST', `${apiBase}/auth/signup`, {
      firstName: 'E2E',
      lastName: 'Tester',
      email,
      password
    }).then((signupRes) => {
      expect(signupRes.status).to.be.oneOf([200, 201]);

      // Login to receive token and user
      cy.request('POST', `${apiBase}/auth/login`, { email, password }).then((loginRes) => {
        expect(loginRes.status).to.equal(200);
        const token = loginRes.body.token;
        const user = loginRes.body.user;
        expect(token).to.be.a('string');

        // Persist auth to localStorage so the app treats us as logged in
        cy.visit('/', {
          onBeforeLoad(win) {
            win.localStorage.setItem('authToken', token);
            win.localStorage.setItem('user', JSON.stringify(user));
          }
        });

        // Navigate to goals page
        cy.visit('/goals');

        // Fill the GoalForm
        cy.get('input[name="title"]').type('E2E Goal');
        cy.get('textarea[name="description"]').type('Create a goal via Cypress');
        cy.get('input[name="target_completion_date"]').type('2026-01-01');
        cy.get('select[name="difficulty_level"]').select('easy');

        // Intercept the create goal request and alias it
        cy.intercept('POST', '/api/goals').as('createGoal');
        cy.get('button[type="submit"]').contains(/Create Goal/i).click();

        cy.wait('@createGoal').its('response.statusCode').should('be.oneOf', [200, 201]);
        cy.get('@createGoal').then((xhr) => {
          const created = xhr.response.body.data;
          expect(created).to.have.property('id');

          // Create a challenge via API (associate via created_by)
          cy.request('POST', `${apiBase}/challenges`, {
            title: 'E2E Challenge',
            description: 'Challenge created during e2e',
            difficulty_level: 'easy',
            category: 'e2e',
            created_by: user.id
          }).then((chRes) => {
            expect(chRes.status).to.be.oneOf([200, 201]);

            // Now mark the goal complete by updating progress to 100
            cy.request('PUT', `${apiBase}/goals/${created.id}`, { progress_percentage: 100 })
              .then((uRes) => {
                expect(uRes.status).to.equal(200);

                // Revisit goals page and assert progress bar shows 100%
                cy.visit('/goals');
                cy.contains('100% complete').should('exist');
              });
          });
        });
      });
    });
  });
});
