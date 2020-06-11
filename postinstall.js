const fs = require('fs');
require('dotenv').config();

// Update environment variables for development
function devEnv()
{
  // Update environment file to use development environment variables
  const targetPath = './src/environments/environment.prod.ts';
  const envConfigFile = `export const environment = {
     production: true,
     auth0: {
       domain: '${process.env.auth0domain}',
       clientID: '${process.env.auth0client}',
       audience: '${process.env.audience}',
       redirectUri: '${process.env.loginurl}',
       logoutUri: '${process.env.logouturl}'
    },
     backend: {
       domain: '${process.env.apiurl}'
    }
  };
  `;

  return fs.writeFile(targetPath, envConfigFile, function (err) {
     if (err) {
       throw console.error(err);
     } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
     }
  });
}
