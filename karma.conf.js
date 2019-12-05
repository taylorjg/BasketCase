module.exports = config => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'src/tests/setup.js',
      'src/tests/**/*.tests.js'
    ],
    preprocessors: { ['src/tests/**/*.js']: ['webpack'] },
    webpack: require('./webpack.config'),
    webpackMiddleware: { stats: 'errors-only' },
    browsers: ['Chrome'],
    reporters: ['spec'],
    autoWatch: false,
    singleRun: true
  })
}
