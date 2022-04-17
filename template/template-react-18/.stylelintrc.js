module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-rational-order',
        'stylelint-config-prettier',
    ],
    plugins: [
        'stylelint-order',
        'stylelint-declaration-block-no-ignored-properties',
        'stylelint-scss',
    ],
    rules: {
        // http://stylelint.cn/
        'keyframes-name-pattern': null,
        'selector-class-pattern': null,
        'comment-empty-line-before': null,
        'function-name-case': 'lower',
        'no-invalid-double-slash-comments': null,
        'no-descending-specificity': null,
        'declaration-empty-line-before': null,
        'at-rule-no-unknown': null,
        'rule-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['after-comment'],
            },
        ],
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global'],
            },
        ],
        'unicode-bom': 'never',
        // https://github.com/hudochenkov/stylelint-order
        'order/order': [
            'dollar-variables',
            'custom-properties',
            'declarations',
            'at-rules',
            'rules',
        ],
    },
    ignoreFiles: ['node_modules/**/*', 'dist/**/*', '**/typings/**/*'],
}
