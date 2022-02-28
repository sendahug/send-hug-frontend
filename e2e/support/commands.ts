declare global {
  namespace Cypress {
      interface Chainable {
        navigateTo(navLinkNumber: number): Chainable;
      }
  }
}

// navigate via clicking the nav menu link
Cypress.Commands.add('navigateTo', (navLinkNumber: number) =>
  cy.get('.navLink').eq(navLinkNumber).click(),
);

export {};
