/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000");
});

describe("Profile Page", () => {
  it("Profile page requires login", () => {
    cy.get('[href="/profile"]').click();
    cy.get("button").contains("Log in").click();
    cy.contains("Favorite Artists").should("have.length", 1);
  });

  it("Toggle Delete Account Confirmation modal open", () => {
    cy.get('[href="/profile"]').click();
    cy.get("button").contains("Log in").click();
    cy.get('[data-testid="delete-acc"]').click();
    cy.get("div.ant-modal-body").contains("Delete Account");
  });

  it("Toggle Delete Account Confirmation modal closed", () => {
    cy.get('[href="/profile"]').click();
    cy.get("button").contains("Log in").click();
    cy.get('[data-testid="delete-acc"]').click();
    cy.contains("Cancel").click();

    cy.get("div.ant-modal-body").should("have.length", 0);
    cy.get('[data-testid="delete-acc"]').should(
      "have.attr",
      "aria-checked",
      "false"
    );
  });
});
