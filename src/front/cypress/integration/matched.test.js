/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000");
});

describe("Meet Page", () => {
  it("Matched page requires login", () => {
    cy.get('[href="/matched"]').click();
    cy.get("button").contains("Log in").click();

    cy.get("div.container").should("have.length", 1);
    cy.get("h1").contains("Matches");
    cy.get('[data-testid="match"]').should('have.length', 8);
  });

  it("Delete Match modal open", () => {
    cy.get('[href="/matched"]').click();
    cy.get("button").contains("Log in").click();
    cy.get('[button-testid="delete-match-1"]').click();

    cy.get("div.ant-modal-body").contains("Delete Match");
  });

  it("Delete Match modal closed", () => {
    cy.get('[href="/matched"]').click();
    cy.get("button").contains("Log in").click();
    cy.get('[button-testid="delete-match-1"]').click();
    cy.contains("Cancel").click();

    cy.get('div.ant-modal-body').should('not.exist')
  });
});
