const dotenv = require('dotenv').config();
var fs = require('fs')

fs.readFile('dist/app.bundle.min.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/{production:e.env.production,auth0:{domain:e.env.auth0domain,clientID:e.env.auth0client,audience:e.env.audience,redirectUri:e.env.loginurl,logoutUri:e.env.logouturl},backend:{domain:e.env.apiurl},vapidKey:""}/g,
    `{production:'${process.env.PRODUCTION}',auth0:{domain:'${process.env.AUTH0_DOMAIN}',clientID:'${process.env.AUTH0_CLIENT}',audience:'${process.env.AUDIENCE}',redirectUri:'${process.env.LOGIN_REDIRECT}',logoutUri:'${process.env.LOGOUT_REDIRECT}'},backend:{domain:'${process.env.BACKEND_URL}'},vapidKey:'${process.env.PUBLIC_KEY}'}`);

  fs.writeFile('dist/app.bundle.min.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
