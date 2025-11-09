describe('SkillWise End-to-End Smoke Test', () => {
  const apiUrl = 'http://localhost:3001';
  const timestamp = Date.now();
  const testUser = {
    firstName: 'E2E',
    lastName: 'Tester',
    email: `e2e+${timestamp}@example.com`,
    password: 'Password123'
  };

  const goalTitle = `E2E Goal ${timestamp}`;
  const goalDescription = 'Goal created by Cypress E2E test';
  const challengeTitle = `E2E Challenge ${timestamp}`;

  it('signs up, logs in, creates a goal, creates a challenge, and marks it complete', () => {
    // Create account via API (idempotent thanks to timestamped email)
    cy.request('POST', `${apiUrl}/api/auth/signup`, {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      password: testUser.password
    }).then((signupResp) => {
      // proceed to login (some backends return 201 even if user exists)
      cy.request('POST', `${apiUrl}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }).then((loginResp) => {
        const token = loginResp.body.token;
        const user = loginResp.body.user;

        // Visit the goals page with token pre-populated in localStorage
        cy.visit('/goals', {
          onBeforeLoad(win) {
            win.localStorage.setItem('authToken', token);
            win.localStorage.setItem('user', JSON.stringify(user));
          }
        });

        // Fill out goal form
        cy.get('input[placeholder="e.g., Learn React Hooks"]').should('be.visible').type(goalTitle);
        cy.get('textarea[placeholder="Describe what you want to achieve"]').type(goalDescription);
        // set a target date (YYYY-MM-DD)
        cy.get('input[type="date"]').type('2026-01-01');

        cy.contains('button', 'Create Goal').click();

        // Confirm success message
        cy.contains('Goal created successfully.').should('be.visible');

        // Get the created goal via API to obtain its ID
        cy.request({
          method: 'GET',
          url: `${apiUrl}/api/goals`,
          headers: { Authorization: `Bearer ${token}` }
        }).then((goalsResp) => {
          const goals = goalsResp.body.goals || goalsResp.body || [];
          const created = goals.find(g => g.title === goalTitle) || goals[0];
          expect(created).to.exist;

          const goalId = created.id;

          // Create a challenge linked to the goal via API
          cy.request({
            method: 'POST',
            url: `${apiUrl}/api/challenges`,
            headers: { Authorization: `Bearer ${token}` },
            body: {
              title: challengeTitle,
              description: 'Challenge created by Cypress test',
              status: 'open',
              goalId
            }
          }).then((createChallengeResp) => {
            expect(createChallengeResp.status).to.be.oneOf([200,201]);
            const challenge = createChallengeResp.body.challenge || createChallengeResp.body;
            expect(challenge).to.have.property('id');

            // Visit progress page and mark the challenge complete via UI
            cy.visit('/progress', {
              onBeforeLoad(win) {
                win.localStorage.setItem('authToken', token);
                win.localStorage.setItem('user', JSON.stringify(user));
              }
            });

            // Find our challenge in the list and click the Mark Complete button
            cy.contains(challengeTitle).should('be.visible').parents('li').within(() => {
              cy.contains('button', /Mark Complete|Mark Incomplete/).click();
              // After clicking, status should eventually be 'completed'
              cy.contains('completed', { timeout: 5000 }).should('be.visible');
            });

            // Verify backend updated
            cy.request({
              method: 'GET',
              url: `${apiUrl}/api/challenges/${challenge.id}`,
              headers: { Authorization: `Bearer ${token}` }
            }).then((verifyResp) => {
              expect(verifyResp.status).to.eq(200);
              expect(verifyResp.body.challenge || verifyResp.body).to.have.property('status', 'completed');
            });
          });
        });
      });
    });
  });
});
