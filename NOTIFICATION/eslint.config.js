import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginTS from '@typescript-eslint/eslint-plugin';
import parserTS from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTS,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTS,
      import: eslintPluginImport,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
];
