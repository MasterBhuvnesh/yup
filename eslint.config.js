// https://docs.expo.dev/guides/using-eslint/
// This configuration file sets up ESLint & Prettier for an Expo project
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', '/.expo', 'node_modules', '/.vscode'],
  },
]);
