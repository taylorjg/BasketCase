module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'client/tests/facetValue.component.tests.js'
    ],
    preprocessors: {
      ['client/tests/**/*.tests.js']: ['webpack']
    },
    webpack: require('./webpack.config'),
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
  });
};
