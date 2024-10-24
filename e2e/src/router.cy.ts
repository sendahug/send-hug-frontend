describe("Send A Hug Router", () => {
  // login
  // TODO: figure out why this isn't persisting
  before(() => {
    cy.visit("http://localhost:3000/login");
    cy.wait(500);
    cy.get("#username").type(Cypress.env("ADMIN_USERNAME"));
    cy.get("#password").type(Cypress.env("ADMIN_PASSWORD"));
    cy.get("#logIn").click();
    cy.wait(1000);
  });

  // check the user is sent to the right page upon navigation
  it("should send the user to the correct page", () => {
    // main page
    cy.visit("http://localhost:3000/");
    cy.get("app-main-page").should("be.visible").should("not.be.undefined");

    // full list
    cy.visit("http://localhost:3000/list/New");
    cy.get("app-full-list").should("be.visible").should("not.be.undefined");

    // about page
    cy.visit("http://localhost:3000/about");
    cy.get("app-about").should("be.visible").should("not.be.undefined");

    // search results
    cy.visit("http://localhost:3000/search?query=test");
    cy.get("app-search-results").should("be.visible").should("not.be.undefined");

    // sitemap
    cy.visit("http://localhost:3000/sitemap");
    cy.get("app-site-map").should("be.visible").should("not.be.undefined");
  });

  // check an error page is shown if the given path doesn't exist in the router
  it("should show an error page if the path doesn't exist", () => {
    cy.visit("http://localhost:3000/fdsd");
    cy.get("app-error-page").should("be.visible").should("not.be.undefined");
  });

  // check the correct sub-route is shown for those paths that have sub-routes
  // TODO: Figure out why this isn't registering auth
  it("should show the correct sub-route - messages", () => {
    // inbox
    cy.visit("http://localhost:3000/messages/inbox");
    cy.wait(1000);
    cy.get("app-messages").should("be.visible").should("not.be.undefined");
    cy.get("h3").eq(0).should("have.text", "inbox");
    // check messages route is marked active
    cy.get(".navLink").eq(2).should("have.class", "active");

    // outbox
    cy.visit("http://localhost:3000/messages/outbox");
    cy.wait(1000);
    cy.get("app-messages").should("be.visible").should("not.be.undefined");
    cy.get("h3").eq(0).should("have.text", "outbox");
    // check messages route is marked active
    cy.get(".navLink").eq(2).should("have.class", "active");

    // threads
    cy.visit("http://localhost:3000/messages/threads");
    cy.wait(1000);
    cy.get("app-messages").should("be.visible").should("not.be.undefined");
    cy.get("h3").eq(0).should("have.text", "threads");
    // check messages route is marked active
    cy.get(".navLink").eq(2).should("have.class", "active");

    // thread
    cy.visit("http://localhost:3000/messages/thread/1");
    cy.wait(1000);
    cy.get("app-messages").should("be.visible").should("not.be.undefined");
    cy.get("h3").eq(0).should("have.text", "thread");
    // check messages route is marked active
    cy.get(".navLink").eq(2).should("have.class", "active");
  });

  // check the correct sub-route is shown for those paths that have sub-routes
  it("should show the correct sub-route - new item", () => {
    // new post
    cy.visit("http://localhost:3000/new/Post");
    cy.wait(1000);
    cy.get("app-new-item").should("be.visible").should("not.be.undefined");
    cy.get("#newTitle").should("have.text", "New Post");

    // new message
    cy.visit("http://localhost:3000/new/Message");
    cy.wait(1000);
    cy.get("app-new-item").should("be.visible").should("not.be.undefined");
    cy.get("#newTitle").should("have.text", "New Message");
  });

  // check the correct sub-route is shown for those paths that have sub-routes
  it("should show the correct sub-route - full list", () => {
    // full new
    cy.visit("http://localhost:3000/list/New");
    cy.get("app-full-list").should("be.visible").should("not.be.undefined");
    cy.get("#listTitle").should("have.text", "New Items");

    // full suggested
    cy.visit("http://localhost:3000/list/Suggested");
    cy.get("app-full-list").should("be.visible").should("not.be.undefined");
    cy.get("#listTitle").should("have.text", "Suggested Items");
  });

  // TODO: Mailbox navigation (using buttons)
  // TODO: Admin dashboard navigation

  // logout
  // TODO: Figure out why that doesn't work
  after(() => {
    cy.visit("http://localhost:3000/user");
    cy.wait(1000);
    cy.get("button").contains("Log Out").scrollIntoView().click();
  });
});
