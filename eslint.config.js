import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["src/**/*.spec.ts"],
    extends: [tseslint.configs.strict, eslintPluginPrettierRecommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.strict, eslintPluginPrettierRecommended],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["e2e/**/*.ts"],
    extends: [tseslint.configs.strict, eslintPluginPrettierRecommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.cypress,
      },
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
