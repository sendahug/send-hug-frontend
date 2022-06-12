const dotenv = require('dotenv').config();
var fs = require('fs');
const { dist } = require('./gulpfile');

// Run build
dist();

// Update env vars
fs.readFile('dist/app.bundle.min.js', 'utf8', function (err,data) {
  if (err) {
    console.log(err);
    return;
  }
  var result = data.replace(/{production:!0,auth0:{domain:process.env.auth0domain,clientID:process.env.auth0client,audience:process.env.audience,redirectUri:process.env.loginurl,logoutUri:process.env.logouturl},backend:{domain:process.env.apiurl},vapidKey:""}/g,
    `{production:'${process.env.PRODUCTION}',auth0:{domain:'${process.env.AUTH0_DOMAIN}',clientID:'${process.env.AUTH0_CLIENT}',audience:'${process.env.AUDIENCE}',redirectUri:'${process.env.LOGIN_REDIRECT}',logoutUri:'${process.env.LOGOUT_REDIRECT}'},backend:{domain:'${process.env.BACKEND_URL}'},vapidKey:'${process.env.PUBLIC_KEY}'}`);

  fs.writeFile('dist/app.bundle.min.js', result, 'utf8', function (err) {
     if (err) {
        console.log(err);
        return;
      }
  });
});
