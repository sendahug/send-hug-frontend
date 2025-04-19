import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["src/**/*.spec.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier],
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
    extends: [tseslint.configs.strict, eslintConfigPrettier],
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
