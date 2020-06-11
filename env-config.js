const dotenv = require('dotenv').config();
var fs = require('fs')

fs.readFile('dist/app.bundle.min.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/{production:e.env.production,auth0:{domain:e.env.auth0domain,clientID:e.env.auth0client,audience:e.env.audience,redirectUri:e.env.loginurl,logoutUri:e.env.logouturl},backend:{domain:e.env.apiurl}}/g,
    `{production:'${process.env.production}',auth0:{domain:'${process.env.auth0domain}',clientID:'${process.env.auth0client}',audience:'${process.env.audience}',redirectUri:'${process.env.loginurl}',logoutUri:'${process.env.logouturl}'},backend:{domain:'${process.env.apiurl}'}}`);

  fs.writeFile('dist/app.bundle.min.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
