export const environment = {
  production: true,
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT,
    audience: process.env.AUDIENCE,
    redirectUri: process.env.LOGIN_REDIRECT,
    logoutUri: process.env.LOGOUT_REDIRECT,
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
  backend: {
    domain: process.env.BACKEND_URL,
  },
  vapidKey: process.env.PUBLIC_KEY,
};
