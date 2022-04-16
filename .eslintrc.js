/* eslint-disable no-undef */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "prettier",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    rules: {
        "eqeqeq": "error",
        "class-methods-use-this": "warn",
        "no-shadow": "error",
        "no-restricted-syntax": "error",
        "react/react-in-jsx-scope": "off",
        "no-var": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
        "quotes": ["error", "double"],
    }
};