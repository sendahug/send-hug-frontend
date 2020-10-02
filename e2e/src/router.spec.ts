import { browser, by, element, protractor } from 'protractor';

describe('Send A Hug Router', () => {
  // check the user is sent to the right page upon navigation
  it('should send the user to the correct page', () => {
    let ec = protractor.ExpectedConditions;

    // main page
    browser.get('http://localhost:3000/');
    browser.wait(ec.urlIs('http://localhost:3000/'), 2000);
    expect(element(by.tagName('app-main-page'))).toBeDefined();

    // user page
    browser.get('http://localhost:3000/user');
    browser.wait(ec.urlIs('http://localhost:3000/user'), 2000);
    expect(element(by.tagName('app-user-page'))).toBeDefined();

    // mailbox
    browser.get('http://localhost:3000/messages/inbox');
    browser.wait(ec.urlIs('http://localhost:3000/messages/inbox'), 2000);
    expect(element(by.tagName('app-messages'))).toBeDefined();

    // new item
    browser.get('http://localhost:3000/new/Post');
    browser.wait(ec.urlIs('http://localhost:3000/new/Post'), 2000);
    expect(element(by.tagName('app-new-item'))).toBeDefined();

    // full list
    browser.get('http://localhost:3000/list/New');
    browser.wait(ec.urlIs('http://localhost:3000/list/New'), 2000);
    expect(element(by.tagName('app-full-list'))).toBeDefined();

    // about page
    browser.get('http://localhost:3000/about');
    browser.wait(ec.urlIs('http://localhost:3000/about'), 2000);
    expect(element(by.tagName('app-about'))).toBeDefined();

    // search results
    browser.get('http://localhost:3000/search?query=test');
    browser.wait(ec.urlIs('http://localhost:3000/search?query=test'), 2000);
    expect(element(by.tagName('app-search-results'))).toBeDefined();

    // admin dashboard
    browser.get('http://localhost:3000/admin');
    browser.wait(ec.urlIs('http://localhost:3000/admin'), 2000);
    expect(element(by.tagName('app-admin-dashboard'))).toBeDefined();

    // settings
    browser.get('http://localhost:3000/settings');
    browser.wait(ec.urlIs('http://localhost:3000/settings'), 2000);
    expect(element(by.tagName('app-settings'))).toBeDefined();

    // sitemap
    browser.get('http://localhost:3000/sitemap');
    browser.wait(ec.urlIs('http://localhost:3000/sitemap'), 2000);
    expect(element(by.tagName('app-sitemap'))).toBeDefined();
  });

  // check an error page is shown if the given path doesn't exist in the router
  it('should show an error page if the path doesn\'t exist', () => {
    let ec = protractor.ExpectedConditions;
    browser.get('http://localhost:3000/fdsd');
    browser.wait(ec.urlIs('http://localhost:3000/fdsd'), 2000);

    expect(element(by.tagName('app-error-page'))).toBeDefined();
  });

  // check the correct sub-route is shown for those paths that have sub-routes
  it('should show the correct sub-route - messages', () => {
    let ec = protractor.ExpectedConditions;

    // inbox
    browser.get('http://localhost:3000/messages/inbox');
    browser.wait(ec.urlIs('http://localhost:3000/messages/inbox'), 2000);
    expect(element(by.tagName('app-messages'))).toBeDefined();
    element(by.tagName('h3')).getText().then(text => {
      expect(text).toBe('Inbox');
    });

    // outbox
    browser.get('http://localhost:3000/messages/outbox');
    browser.wait(ec.urlIs('http://localhost:3000/messages/outbox'), 2000);
    expect(element(by.tagName('app-messages'))).toBeDefined();
    element(by.tagName('h3')).getText().then(text => {
      expect(text).toBe('Outbox');
    });

    // threads
    browser.get('http://localhost:3000/messages/threads');
    browser.wait(ec.urlIs('http://localhost:3000/messages/threads'), 2000);
    expect(element(by.tagName('app-messages'))).toBeDefined();
    element(by.tagName('h3')).getText().then(text => {
      expect(text).toBe('Threads');
    });

    // thread
    browser.get('http://localhost:3000/messages/thread/1');
    browser.wait(ec.urlIs('http://localhost:3000/messages/thread/1'), 2000);
    expect(element(by.tagName('app-messages'))).toBeDefined();
    element(by.tagName('h3')).getText().then(text => {
      expect(text).toBe('Thread');
    });
  });

  // check the correct sub-route is shown for those paths that have sub-routes
  it('should show the correct sub-route - new item', () => {
    let ec = protractor.ExpectedConditions;

    // new post
    browser.get('http://localhost:3000/new/Post');
    browser.wait(ec.urlIs('http://localhost:3000/new/Post'), 2000);
    expect(element(by.tagName('app-new-item'))).toBeDefined();
    element(by.id('newTitle')).getText().then(text => {
      expect(text).toBe('New Post');
    });

    // new message
    browser.get('http://localhost:3000/new/Message');
    browser.wait(ec.urlIs('http://localhost:3000/new/Message'), 2000);
    expect(element(by.tagName('app-new-item'))).toBeDefined();
    element(by.id('newTitle')).getText().then(text => {
      expect(text).toBe('New Message');
    });
  });

  // check the correct sub-route is shown for those paths that have sub-routes
  it('should show the correct sub-route - full list', () => {
    let ec = protractor.ExpectedConditions;

    // full new
    browser.get('http://localhost:3000/list/New');
    browser.wait(ec.urlIs('http://localhost:3000/list/New'), 2000);
    expect(element(by.tagName('app-full-list'))).toBeDefined();
    element(by.id('listTitle')).getText().then(text => {
      expect(text).toBe('New Items');
    });

    // full suggested
    browser.get('http://localhost:3000/list/Suggested');
    browser.wait(ec.urlIs('http://localhost:3000/list/Suggested'), 2000);
    expect(element(by.tagName('app-full-list'))).toBeDefined();
    element(by.id('listTitle')).getText().then(text => {
      expect(text).toBe('Suggested Items');
    });
  });

  // TODO: Mailbox navigation (using buttons)
  // TODO: Admin dashboard navigation
});
