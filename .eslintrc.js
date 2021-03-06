module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    '@vue/prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  plugins: ['sort-exports'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'comma-dangle': ['error', 'never'],
    'sort-imports': ['error'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    'sort-exports/sort-exports': ['error', { sortDir: 'asc' }],

    // Vue specific
    'vue/no-unused-vars': ['error', { ignorePattern: '^_' }],
    'vue/require-prop-type-constructor': 'error',
    'vue/require-default-prop': 'error',
    'vue/prop-name-casing': 'error',
    'vue/order-in-components': 'error',
    'vue/custom-event-name-casing': ['error', { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }]
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
