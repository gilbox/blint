var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  var settings = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    //basePath: 'app/assets/javascripts/',
    basePath: '',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'spec/test_index.js'
    ],

    // list of files to exclude
    exclude: [
      '**/bundle.js',
      '**/vendor.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/test_index.js': ['webpack', 'sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter')
    ],

    // Specific required configurations for webpack
    webpack: {
      devtool: 'inline-source-map',
      resolve: webpackConfig.resolve,
      module: {
        loaders: [
          {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']}
        ]
      },
      plugins: [
      ]
    }

  };

  config.set(settings);
  return settings;
};
