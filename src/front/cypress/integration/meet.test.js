/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000/meet");
});

describe("Meet Page", () => {
  it("Meet page loading", () => {
    cy.get(".ant-spin.ant-spin-lg.ant-spin-spinning");
  });
  it("Unmet user rendered", () => {
    cy.contains("Artists in Common");
    cy.contains("Songs in Common");
    cy.get(".profilePhoto");
    cy.get('[data-testid="left-swipe"]');
    cy.get('[data-testid="right-swipe"]');
  });
});
