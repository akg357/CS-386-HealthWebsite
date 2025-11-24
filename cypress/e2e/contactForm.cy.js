describe('Contact Form Acceptance Test', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html'); // Use your Live Server URL
  });

  it('should allow a user to fill and submit the contact form', () => {
    cy.get('#contactForm').should('be.visible');
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#message').type('I want guidance on healthy weight.');
    cy.get('#btnSubmit').click();
    cy.get('.successMessage')
      .should('be.visible')
      .and('contain', 'Thank you for contacting us!');
  });
});