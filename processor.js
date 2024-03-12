const MagicString = require("magic-string");
const fs = require("fs");
const dotenv = require("dotenv");

/**
 * Rollup plugin that replaces the Angular templateUrl in test files with
 * the inlined template. Originally written as a Browserify transform:
 * https://github.com/shirblc/angular-gulp/pull/1
 *
 * Inspited by @rollup/plugin-replce
 * https://github.com/rollup/plugins/blob/master/packages/replace/src/index.js
 */
exports.inlineComponentTemplate = function () {
  return {
    name: "plugin-inline-template",
    transform(code) {
      const magicString = new MagicString(code);

      magicString.replace(/(templateUrl:)(.*)(\.component\.html")/, (match) => {
        const componentName = match.split(".")[1].substring(1);
        if (componentName == "my") return match;
        let componentTemplateURL;

        if (componentName == "app") {
          componentTemplateURL = __dirname + `/src/app/${componentName}.component.html`;
        } else if (componentName.includes("Form")) {
          componentTemplateURL =
            __dirname +
            `/src/app/components/forms/${componentName}/${componentName}.component.html`;
        } else {
          componentTemplateURL =
            __dirname + `/src/app/components/${componentName}/${componentName}.component.html`;
        }

        componentTemplate = fs.readFileSync(componentTemplateURL);

        return `template: \`${componentTemplate}\``;
      });

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};

/**
 * Rollup plugin for inlining the SVGs.
 * Originally written as a Browserify transform:
 * https://github.com/sendahug/send-hug-frontend/commit/d0cb971da5801ebfecb05184d09386e743b7405b
 */
exports.inlineSVGs = function () {
  return {
    name: "inliner",
    transform(code) {
      const magicString = new MagicString(code);

      // inline the SVGs
      magicString.replace(/(<img src="..\/assets.)(.*)(.">)/g, (match) => {
        const altIndex = match.indexOf("alt");
        const url = match.substring(13, altIndex - 2);
        const svg = fs.readFileSync(__dirname + `/src/${url}`);

        return `${svg}`;
      });

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};

/**
 * Sets the angular environment to production.
 * Originally written as a Browserify transform:
 * https://github.com/sendahug/send-hug-frontend/blob/c783442236d07d4aa9d7439b3bc74e450bf4b5ec/gulpfile.js#L232
 */
exports.setProductionEnv = function () {
  return {
    name: "production-setter",
    transform(code) {
      const magicString = new MagicString(code);
      let tempString = magicString.toString();

      const environment = tempString.match(/environments\/environment/);

      if (environment) {
        const start = environment.index;
        const end = start + environment[0].length;
        const newString = `environments/environment.prod`;

        magicString.overwrite(start, end, newString);
      }

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};

/**
 * Updates the environment variables in the app based on
 * the environment variables
 */
exports.updateEnvironmentVariables = function (currentMode = "development") {
  return {
    name: "rollup-plugin-update-environment-variables",
    transform(code) {
      const magicString = new MagicString(code);
      dotenv.config({
        path: `./.env.${currentMode}`,
      });

      magicString.replaceAll(/process\.env\.(.+),/g, (match) => {
        const envVar = match.split(".")[2].split(",")[0];
        const value = process.env[envVar];
        return `'${value}',`;
      });

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};

/**
 * Updates each component's template URL to the production
 * structure.
 */
exports.updateComponentTemplateUrl = function () {
  return {
    name: "plugin-template-updater",
    transform(code) {
      const magicString = new MagicString(code);

      magicString.replace(/(templateUrl:)(.*)(\.component\.html")/, (match) => {
        const componentName = match.split(".")[1].substring(1);
        return `templateUrl: "./app/${componentName}.component.html"`;
      });

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};
