/* eslint-disable @typescript-eslint/no-namespace */
// This is the way Cypress docs indicate it should be done
// https://docs.cypress.io/app/tooling/typescript-support#Extending-TypeScript-Support
declare global {
  namespace Cypress {
    interface Chainable {
      navigateTo(navLinkNumber: number): Chainable;
    }
  }
}

// navigate via clicking the nav menu link
Cypress.Commands.add("navigateTo", (navLinkNumber: number) =>
  cy.get(".navLink").eq(navLinkNumber).click(),
);

export {};
