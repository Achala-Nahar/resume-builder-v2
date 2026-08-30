import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**"],
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        structuredClone: "readonly",
      },
    },
  },

  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        beforeAll: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
      },
    },
  },

  js.configs.recommended,
];
