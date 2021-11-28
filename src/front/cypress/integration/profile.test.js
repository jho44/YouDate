/// <reference types="cypress" />
beforeEach(() => {
  cy.visit("localhost:3000/profile");
});

describe("Profile Page", () => {
  it("Profile page requires login", () => {
    cy.contains("Fake User (fake pronouns)");
    cy.contains("0");
    cy.contains("fake description");
    cy.contains("Favorite Artists");
    cy.contains("No favorite artists at this time");
    cy.contains("No favorite songs at this time");

    const icons = [
      "SearchIcon",
      "SchoolIcon",
      "WorkIcon",
      "FavoriteIcon",
      "LocationOnIcon",
      "AccountBalanceIcon",
      "HeightIcon",
    ];
    const iconContents = [
      "Other",
      "fake education",
      "fake occupation",
      "fake sexual orientation",
      "fake location",
      "fake political view",
      "fake height",
    ];
    let genArr = Array.from({ length: icons.length }, (v, k) => k + 1);
    cy.wrap(genArr).each((index) => {
      cy.get(`[data-testid="${icons[index - 1]}"]`);
      cy.contains(iconContents[index - 1]);
    });

    const qas = [
      {
        Q: "Life goal of mine",
        A: "fake life goal",
      },
      {
        Q: "My life peaked when...",
        A: "fake life peaked",
      },
      {
        Q: "I feel famous when...",
        A: "fake feel famous",
      },
      {
        Q: "Biggest risk I've ever taken",
        A: "fake biggest risk",
      },
    ];
    genArr = Array.from({ length: qas.length }, (v, k) => k + 1);
    cy.wrap(genArr).each((index) => {
      cy.contains(qas[index - 1]["Q"]);
      cy.contains(qas[index - 1]["A"]);
    });
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
