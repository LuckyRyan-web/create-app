/* eslint-disable no-undef */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    env: {
        browser: true,
        es2021: true,
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint', 'prettier', 'jsx-a11y'],
    rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        'no-unused-vars': 'warn',
        'no-use-before-define': 'off',
        'react/react-in-jsx-scope': 'off',
        'prettier/prettier': [
            'error',
            {
                htmlWhitespaceSensitivity: 'ignore',
                singleQuote: true,
                semi: false,
                tabWidth: 4,
                trailingComma: 'es5',
            },
        ],
    },
}
