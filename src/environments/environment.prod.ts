export const environment = {
  production: true,
  auth0: {
    domain: 'dev-sbac.auth0.com',
    clientID:'rgZL4I04pep3P2GRIEVQtDkWcHjv9sru',
    audience: 'sendhug',
    redirectUri: 'http://localhost:3000/user',
    logoutUri: 'http://localhost:3000'
  },
  backend: {
    domain: 'http://localhost:5000'
  }
};
