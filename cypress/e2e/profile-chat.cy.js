describe('Profile assistant', () => {
  it('opens, sends a question, preserves history on close and clears it', () => {
    cy.intercept('POST', '/api/chat', { statusCode: 200, body: { answer: 'Janzen welcomes remote work aligned with Philippine daytime or mid-shift hours.' } }).as('chat');
    cy.visit('/');
    cy.contains('button', 'Ask about Janzen').click();
    cy.get('#chat-message').should('have.focus').type('What work interests him?');
    cy.contains('button', /^Send$/).click();
    cy.wait('@chat').its('request.body.messages').should('deep.equal', [{ role: 'user', content: 'What work interests him?' }]);
    cy.get('[role="log"]').should('contain', 'Janzen welcomes remote work');
    cy.get('#chat-message').type('{esc}');
    cy.get('#profile-chat').should('not.exist');
    cy.contains('button', 'Ask about Janzen').should('have.focus').click();
    cy.get('[role="log"]').should('contain', 'Janzen welcomes remote work');
    cy.contains('button', 'Clear conversation').click();
    cy.get('[role="log"]').should('not.contain', 'Janzen welcomes remote work');
  });

  it('keeps a failed question available for retry on a narrow screen', () => {
    cy.viewport(375, 667);
    cy.intercept('POST', '/api/chat', { statusCode: 503, body: { error: 'The free assistant is unavailable right now.' } });
    cy.visit('/');
    cy.contains('button', 'Ask about Janzen').click();
    cy.get('#chat-message').type('What projects has Janzen built?');
    cy.contains('button', /^Send$/).click();
    cy.get('[role="alert"]').should('contain', 'free assistant is unavailable');
    cy.get('#chat-message').should('have.value', 'What projects has Janzen built?');
    cy.get('#profile-chat').then($panel => {
      const box = $panel[0].getBoundingClientRect();
      expect(box.left).to.be.at.least(0);
      expect(box.right).to.be.at.most(375);
      expect(box.top).to.be.at.least(0);
    });
  });
});
