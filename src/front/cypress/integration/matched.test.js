/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000/matched");
});

describe("Meet Page", () => {
  it("Matched page renders", () => {
    cy.contains("Matches");
    cy.get('[data-testid="match"]');
  });

  it("Delete Match modal open", () => {
    cy.get('[button-testid="delete-match-0"]').click();

    cy.get("div.ant-modal-body").contains("Delete Match");
  });

  it("Delete Match modal closed", () => {
    cy.get('[button-testid="delete-match-0"]').click();
    cy.contains("Cancel").click();

    cy.get("div.ant-modal-body").should("not.exist");
  });
});
