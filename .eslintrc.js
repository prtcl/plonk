module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'node_modules',
    '**/node_modules',
    '**/dist',
    'jest.config.js',
  ],
  overrides: [
    {
      files: ['packages/**/*'],
      excludedFiles: '*.test.js',
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_*' },
    ],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],
    'no-console': ['error', { allow: ['info', 'error'] }],
    quotes: ['error', 'single'],
  },
};
