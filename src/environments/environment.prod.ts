export const environment = {
  production: true,
  auth0: {
    domain: process.env.auth0domain,
    clientID: process.env.auth0client,
    audience: process.env.audience,
    redirectUri: process.env.loginurl,
    logoutUri: process.env.logouturl
  },
  backend: {
    domain: process.env.apiurl
  },
  vapidKey: ''
};
