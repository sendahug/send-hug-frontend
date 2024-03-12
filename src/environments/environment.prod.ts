export const environment = {
  production: true,
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT,
    audience: process.env.AUDIENCE,
    redirectUri: process.env.LOGIN_REDIRECT,
    logoutUri: process.env.LOGOUT_REDIRECT,
  },
  backend: {
    domain: process.env.BACKEND_URL,
  },
  vapidKey: process.env.PUBLIC_KEY,
};
