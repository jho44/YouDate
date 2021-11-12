/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000");
});

describe("Meet Page", () => {
  it("Meet page requires login", () => {
    cy.get('[href="/"]').click();
    cy.get("button").contains("Log in").click();
    cy.contains("Artists in Common").should("have.length", 1);
  });
});
