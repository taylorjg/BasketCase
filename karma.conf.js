module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'client/tests/setup.js',
      'client/tests/**/*.tests.js'
    ],
    preprocessors: { ['client/tests/**/*.js']: ['webpack'] },
    webpack: require('./webpack.config'),
    webpackMiddleware: { stats: 'errors-only' },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
  });
};
