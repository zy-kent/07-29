module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: ['vue'],
    // add your custom rules here
    rules: {
        indent: ['error', 4],
        eqeqeq: 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'space-before-function-paren': 'off',
        'object-curly-spacing': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'no-useless-concat': 'off',
        'no-void': 'off',
        'no-new': 'off',
        'no-new-func': 'off',
        'accessor-pairs': 'off',
        'spaced-comment': 'off',
        camelcase: 'warn',
        'no-useless-escape': 'warn',
        'new-cap': 'warn',
        'no-useless-call': 'warn',
        'no-unused-expressions': 'warn',
        'no-new-wrappers': 'warn',
        'no-array-constructor': 'warn',
        'no-plusplus': 'off',
        'no-nested-ternary': 'off',
        semi: 'off',
        'semi-spacing': 'off'
    },
    globals: {
        __DEV__: true
    }
};