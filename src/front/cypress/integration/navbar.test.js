/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000");
});

describe("Navbar", () => {
  it("Navigate to profile page via navbar button", () => {
    cy.get('[href="/profile"]').click();
    cy.url().should("include", "/profile");
  });
  it("Navigate to meet page via navbar button", () => {
    cy.get('[href="/meet"]').click();
    cy.url().should("include", "/meet");
  });
  it("Navigate to matched page via navbar button", () => {
    cy.get('[href="/matched"]').click();
    cy.url().should("include", "/matched");
  });
});
