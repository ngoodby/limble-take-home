module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['./', '../'],
            message: 'Relative imports are not allowed.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.svelte', '*.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
    {
      files: ['src/routes/+layout.svelte', 'tailwind.config.js'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
  ignores: [
    '/build',
    'node_modules',
    '.DS_Store',
    'pnpm-lock.yaml',
    'package-lock.json',
    'yarn.lock',
    '/package',
    '*.md',
  ],
};
