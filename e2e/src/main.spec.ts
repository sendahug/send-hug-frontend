import { browser, by, element, protractor } from 'protractor';

describe('Send A Hug App', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3000/');

    browser.getTitle().then((title) => {
      expect(title).toEqual('Send a Hug');
    })
  });

  // Check user navigation changes the active link in nav bar
  it('should change the active link when the user navigates', () => {
    let ec = protractor.ExpectedConditions;
    browser.get('http://localhost:3000/');
    browser.wait(ec.urlIs('http://localhost:3000/'), 2000);

    // check the first element is marked as active
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).toContain('active');

    // click the second nav button
    element.all(by.className('navLink')).get(2).click();
    browser.wait(ec.urlIs('http://localhost:3000/messages/inbox'), 2000);

    // check the second element is marked active and the first isn't
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).not.toContain('active');

    // click the third nav button
    element.all(by.className('navLink')).get(3).click();
    browser.wait(ec.urlIs('http://localhost:3000/user'), 2000);

    // check the third element is marked active and the second isn't
    expect(element.all(by.className('navLink')).get(3).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).not.toContain('active');

    // click the fourth nav button
    element.all(by.className('navLink')).get(4).click();
    browser.wait(ec.urlIs('http://localhost:3000/about'), 2000);

    // check the fourth element is marked active and the third isn't
    expect(element.all(by.className('navLink')).get(4).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(3).getAttribute('class')).not.toContain('active');
  });

  // Check that when clicking the logo, it navigates to the home page
  it('should navigate to home page when clicking the logo', () => {
    let ec = protractor.ExpectedConditions;
    browser.get('http://localhost:3000/about');
    browser.wait(ec.urlIs('http://localhost:3000/about'), 2000);

    // check the home route isn't marked active
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).not.toContain('active');

    // click the logo
    element(by.id('siteLogo')).click();
    browser.wait(ec.urlIs('http://localhost:3000/'), 2000);

    // check the current page is the home page`
    browser.getCurrentUrl().then(url => {
      expect(url).toBe('http://localhost:3000/');
    })
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).toContain('active');
  });

  // Check that the active links changes when navigating manually
  it('should change the active link when navigating manually', () => {
    // get the about route
    let ec = protractor.ExpectedConditions;
    browser.get('http://localhost:3000/about');
    browser.wait(ec.urlIs('http://localhost:3000/about'), 2000);

    // check the correct route is marked active
    expect(element.all(by.className('navLink')).get(4).getAttribute('class')).toContain('active');

    // get the messages route
    browser.get('http://localhost:3000/messages/outbox');
    browser.wait(ec.urlIs('http://localhost:3000/messages/outbox'), 2000);

    // check the correct route is marked active and the previous route isn't
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(4).getAttribute('class')).not.toContain('active');

    // get the home route
    browser.get('http://localhost:3000/');
    browser.wait(ec.urlIs('http://localhost:3000/'), 2000);

    // check the correct route is marked active and the previous route isn't
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).not.toContain('active');

    // get the user route
    browser.get('http://localhost:3000/user');
    browser.wait(ec.urlIs('http://localhost:3000/user'), 2000);

    // check the correct route is marked active and the previous route isn't
    expect(element.all(by.className('navLink')).get(3).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).not.toContain('active');
  });

  // Check that all messages routes make 'messages' link active
  it('should make messages link active for all messages sub-routes', () => {
    // get the inbox route
    let ec = protractor.ExpectedConditions;
    browser.get('http://localhost:3000/messages/inbox');
    browser.wait(ec.urlIs('http://localhost:3000/messages/inbox'), 2000);
    // check messages route is marked active
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).toContain('active');

    // get the home route (for 'reset')
    browser.get('http://localhost:3000/');
    browser.wait(ec.urlIs('http://localhost:3000/'), 2000);
    // check the messages route isn't marked active anymore
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).not.toContain('active');

    // get the outbox route
    browser.get('http://localhost:3000/messages/outbox');
    browser.wait(ec.urlIs('http://localhost:3000/messages/outbox'), 2000);
    // check messages route is marked active
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).toContain('active');

    // get the home route (for 'reset')
    browser.get('http://localhost:3000/');
    browser.wait(ec.urlIs('http://localhost:3000/'), 2000);
    // check the messages route isn't marked active anymore
    expect(element.all(by.className('navLink')).get(1).getAttribute('class')).toContain('active');
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).not.toContain('active');

    // get the threads route
    browser.get('http://localhost:3000/messages/threads');
    browser.wait(ec.urlIs('http://localhost:3000/messages/threads'), 2000);
    // check messages route is marked active
    expect(element.all(by.className('navLink')).get(2).getAttribute('class')).toContain('active');
  });
});
