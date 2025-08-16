// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Start with the recommended ESLint and TypeScript configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // You can add a section for custom rules
  {
    rules: {
      // Your custom rules go here. For example:
      '@typescript-eslint/no-explicit-any': 'warn', // Warns on using 'any' type
      'no-console': 'warn', // Warns if you use console.log
    },
  },

  // You can also add ignore patterns directly here
  {
    ignores: ['node_modules/', 'dist/'],
  }
);