import MagicString from "magic-string";
import fs from "fs";
import dotenv from "dotenv";

/**
 * Rollup plugin that replaces the Angular templateUrl in test files with
 * the inlined template. Originally written as a Browserify transform:
 * https://github.com/shirblc/angular-gulp/pull/1
 *
 * Inspited by @rollup/plugin-replce
 * https://github.com/rollup/plugins/blob/master/packages/replace/src/index.js
 */
export function inlineComponentTemplate() {
  return {
    name: "plugin-inline-template",
    transform(code) {
      const magicString = new MagicString(code);
      const commonComponents = fs.readdirSync("./src/app/common/components");
      const adminComponents = fs.readdirSync("./src/app/admin/components");
      const userComponents = fs.readdirSync("./src/app/user/components");

      magicString.replace(/(templateUrl:)(.*)(\.component\.html")/, (match) => {
        const componentName = match.split(".")[1].substring(1);
        if (componentName == "my") return match;
        let componentTemplateURL;

        if (componentName == "app") {
          componentTemplateURL = __dirname + `/src/app/${componentName}.component.html`;
        } else if (commonComponents.includes(componentName)) {
          componentTemplateURL =
            __dirname +
            `/src/app/common/components/${componentName}/${componentName}.component.html`;
        } else if (adminComponents.includes(componentName)) {
          componentTemplateURL =
            __dirname +
            `/src/app/admin/components/${componentName}/${componentName}.component.html`;
        } else if (userComponents.includes(componentName)) {
          componentTemplateURL =
            __dirname + `/src/app/user/components/${componentName}/${componentName}.component.html`;
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
}

/**
 * Rollup plugin for inlining the SVGs.
 * Originally written as a Browserify transform:
 * https://github.com/sendahug/send-hug-frontend/commit/d0cb971da5801ebfecb05184d09386e743b7405b
 */
export function inlineSVGs() {
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
}

/**
 * Updates the environment variables in the app based on
 * the environment variables
 */
export function updateEnvironmentVariables(currentMode = "development") {
  return {
    name: "rollup-plugin-update-environment-variables",
    transform(code) {
      const magicString = new MagicString(code);

      // Sets the angular environment to production.
      // Originally written as a Browserify transform:
      // https://github.com/sendahug/send-hug-frontend/blob/c783442236d07d4aa9d7439b3bc74e450bf4b5ec/gulpfile.js#L232
      // And later updated to a rollup plugin:
      // https://github.com/sendahug/send-hug-frontend/blob/0bb431d0a4f4cdba441d25d4dc9fa836f198ba93/processor.js#L91
      if (currentMode != "development") {
        magicString.replace(/environments\/environment/, "environments/environment.prod");
      }

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
}

/**
 * Updates each component's template URL to the production
 * structure.
 */
export function updateComponentTemplateUrl() {
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
}
