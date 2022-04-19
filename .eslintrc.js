/* eslint-disable no-undef */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'prettier',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    rules: {
        'eqeqeq': ['error', 'smart'],
        'class-methods-use-this': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        'no-restricted-syntax': 'error',
        'react/react-in-jsx-scope': 'off',
        'no-var': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/quotes': ['warn', 'single'],
        '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
    }
};
