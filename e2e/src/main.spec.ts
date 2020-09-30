import { browser } from 'protractor';

describe('Send A Hug App', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3000/');

    browser.getTitle().then((title) => {
      expect(title).toEqual('Send a Hug');
    })
  });
});
