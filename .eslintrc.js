module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
    },
  },
  rules: {
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
