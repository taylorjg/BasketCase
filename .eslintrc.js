module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    semi: 2,
    'no-console': 0
  }
}
