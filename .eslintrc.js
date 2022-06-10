const { eslintDirAlias } = require('./dirAlias');

module.exports = {
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:cypress/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['**/tz/**', 'index.stories.jsx', 'index.amp.stories.jsx'],
  plugins: ['prettier', 'json', 'jsx-a11y', 'react-hooks', 'cypress', 'import'],
  rules: {
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/forbid-foreign-prop-types': 'error',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'linebreak-style': process.platform === 'win32' ? 'off' : ['error', 'unix'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-extraneous-dependencies': [
      'off',
      {
        devDependencies: [
          '/.storybook/**',
          '**/stories.jsx',
          '/src/testHelpers/**',
        ],
      },
    ],
    'import/extensions': [1, { json: 'ignorePackages' }],
    'jsx-a11y/no-redundant-roles': 'off',
    'no-use-before-define': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  settings: {
    'import/resolver': {
      alias: eslintDirAlias,
    },
  },
};
