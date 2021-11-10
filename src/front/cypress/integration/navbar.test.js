/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000");
});

describe("Navbar", () => {
  it("Navigate to profile page via navbar button", () => {
    cy.get('[href="/profile"]').click();
    cy.get("button").contains("Log in");
  });
});
