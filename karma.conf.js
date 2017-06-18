module.exports = config => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'client/tests/setup.js',
      'client/tests/**/*.tests.js'
    ],
    preprocessors: { ['client/tests/**/*.js']: ['webpack'] },
    webpack: require('./webpack.config'),
    webpackMiddleware: { stats: 'errors-only' },
    browsers: ['Chrome'],
    reporters: ['spec'],
    autoWatch: false,
    singleRun: true
  });
};
