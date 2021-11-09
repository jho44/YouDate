/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('localhost:3000');
});

describe('Navbar', () => {
  it('Profile page requires login', () => {
    cy.get('[href="/profile"]').click();
    cy.get('button').contains('Log in');
  });

  it('Profile page requires login', () => {
    cy.get('[href="/profile"]').click();
    cy.get('button').contains('Log in').click();
    cy.contains('Favorite Artists').should('have.length', 1);
  });
});