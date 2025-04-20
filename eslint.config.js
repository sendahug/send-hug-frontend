import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jasmine from "eslint-plugin-jasmine";
import pluginCypress from "eslint-plugin-cypress/flat";
import angularEslint from "angular-eslint";

export default defineConfig([
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["src/**/*.spec.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier, jasmine.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      jasmine,
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier, angularEslint.configs.tsRecommended],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["src/**/*.html"],
    extends: [angularEslint.configs.templateAccessibility],
  },
  {
    files: ["e2e/**/*.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier, pluginCypress.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.cypress,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      cypress: pluginCypress,
    },
  },
  {
    files: ["src/sw.js"],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
]);
