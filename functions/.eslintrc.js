module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  ignorePatterns: ['lib/**/*', 'generated/**/*'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'import/no-unresolved': 'off',
    'require-jsdoc': 'off',
    'max-len': ['warn', { code: 100 }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'linebreak-style': ['error', 'unix'],
    'object-curly-spacing': [2, 'always'],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: true,
        capIsNewExceptions: ['Router'],
      },
    ],
  },
};
