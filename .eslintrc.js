module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'google',
  plugins: [
    'html'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'require-jsdoc': 'off',
    'no-warning-comments': ['warn', {
      'terms': ['todo']
    }]
  },
  env: {
    browser: true
  }
};