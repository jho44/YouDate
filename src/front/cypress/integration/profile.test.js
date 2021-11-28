/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000/profile");
});

describe("Profile Page", () => {
  it("Profile page renders", () => {
    cy.contains("Fake User (fake pronouns)");
    cy.contains("0");
    cy.contains("fake description");
    cy.contains("Favorite Artists");
    cy.contains("No favorite artists at this time");
    cy.contains("No favorite songs at this time");

    const textContents = [
      "fake education",
      "fake occupation",
      "fake sexual orientation",
      "fake location",
      "fake height",
      "fake life goal",
      "fake believe it or not",
      "fake life peaked",
      "fake feel famous",
      "fake biggest risk",
    ];

    const selectContents = ["Other", "fake political view"];

    // have to handle "Other" and "Political View" separately since
    // they're select inputs rather than text inputs
    cy.get(".ant-select-selection-item").each((el, ind) => {
      cy.wrap(el).should("have.attr", "title", selectContents[ind]);
    });
    cy.get('input[type="text"]').each((el, ind) => {
      cy.wrap(el).should("have.value", textContents[ind]);
    });

    const labels = [
      "Desired Relationship",
      "Education",
      "Occupation",
      "Sexual Orientation",
      "My Location",
      "Political View",
      "Height",
      "Life goal of mine...",
      "Believe it or not, I...",
      "My life peaked when...",
      "I feel famous when...",
      "Biggest risk I've ever taken",
    ];
    cy.get("label").each((el, ind) => {
      cy.wrap(el).should("have.attr", "title", labels[ind]);
    });

    cy.contains("Submit");
    cy.contains("Reset");
    cy.contains("Logout");
  });

  it("Toggle Delete Account Confirmation modal open", () => {
    cy.get('[data-testid="delete-acc"]').click();
    cy.get("div.ant-modal-body").contains("Delete Account");
  });

  it("Toggle Delete Account Confirmation modal closed", () => {
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
