describe("Send A Hug App", function () {
  it("should have a title", function () {
    cy.visit("http://localhost:3000/");

    cy.title().should("equal", "Send a Hug");
  });

  // Check user navigation changes the active link in nav bar
  it("should change the active link when the user navigates", () => {
    cy.visit("http://localhost:3000/");

    // check the first element is marked as active
    cy.get(".navLink").eq(1).should("have.class", "active");

    // click the second nav button
    cy.navigateTo(2);
    cy.url().should("equal", "http://localhost:3000/login");

    // check the second element is marked active and the first isn't
    cy.get(".navLink").eq(2).should("have.class", "active");
    cy.get(".navLink").eq(1).should("not.have.class", "active");

    // click the third nav button
    cy.navigateTo(3);
    cy.url().should("equal", "http://localhost:3000/about");

    // check the third element is marked active and the second isn't
    cy.get(".navLink").eq(3).should("have.class", "active");
    cy.get(".navLink").eq(2).should("not.have.class", "active");
  });

  // Check that when clicking the logo, it navigates to the home page
  it("should navigate to home page when clicking the logo", () => {
    cy.visit("http://localhost:3000/about");

    // check the home route isn't marked active
    cy.get(".navLink").eq(1).should("not.have.class", "active");

    // click the logo
    cy.get("#siteLogo").click();

    // check the current page is the home page`
    cy.url().should("equal", "http://localhost:3000/");
    cy.get(".navLink").eq(1).should("have.class", "active");
  });

  // Check that the active links changes when navigating manually
  it("should change the active link when navigating manually", () => {
    // get the about route
    cy.visit("http://localhost:3000/about");

    // check the correct route is marked active
    cy.get(".navLink").eq(3).should("have.class", "active");

    // get the messages route
    cy.visit("http://localhost:3000/login");

    // check the correct route is marked active and the previous route isn't
    cy.get(".navLink").eq(2).should("have.class", "active");
    cy.get(".navLink").eq(3).should("not.have.class", "active");

    // get the home route
    cy.visit("http://localhost:3000/");

    // check the correct route is marked active and the previous route isn't
    cy.get(".navLink").eq(1).should("have.class", "active");
    cy.get(".navLink").eq(2).should("not.have.class", "active");
  });

  // check the user is redirected to the search results page upon searching
  it("should redirect to search page upon searching", () => {
    cy.visit("http://localhost:3000/");

    // run search
    cy.get("#searchBtn").click().get("#searchQuery").type("test");
    cy.get(".sendData").eq(0).click();

    // check the user was redirected
    cy.url().should("equal", "http://localhost:3000/search?query=test");
    cy.get("app-search-results").should("be.visible").should("not.be.undefined");
  });
});
