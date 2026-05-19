// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-trailing-spaces': ['error', { ignoreComments: true }],
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^', varsIgnorePattern: '^' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^', varsIgnorePattern: '^' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@?\\w'], // External libraries
            ['^'], // Absolute imports
            ['^@infrastructure(/.*|$)'],
            ['^@application(/.*|$)'],
            ['^@domain(/.*|$)'],
            ['^@enums(/.*|$)'],
            ['^@shared(/.*|$)'],
            ['^\\.'], // Relative imports
          ],
        },
      ],
      indent: ['error', 'tab'],
      '@typescript-eslint/indent': ['error', 'tab'],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
);
