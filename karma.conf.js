// Karma configuration
// Generated on Mon Jul 18 2016 23:36:30 GMT-0500 (PET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/vendor/angular/angular.min.js',
      'public/vendor/angular-mocks/angular-mocks.js',
      'public/vendor/angular-route/angular-route.min.js',
      'public/vendor/angular-sanitize/angular-sanitize.min.js',
      'public/vendor/angular-strap/dist/angular-strap.min.js',
      'public/vendor/angular-spinner/angular-spinner.min.js',
      'public/vendor/ng-debounce/angular-debounce.js',
      'public/vendor/moment/moment.js',
      'public/core/**/*.js',
      'public/core/**/*.html',
      'public/features/**/*.js',
      'public/services/**/*.js',
      'public/features/**/*.html',
      'https://maps.googleapis.com/maps/api/js?sensor=false'
    ],


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'public/core/**/*.js': 'coverage',
      'public/features/**/*.js': 'coverage',
      'public/services/**/*.js': 'coverage',
      'public/core/**/*.html': ['html2js']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
        type: 'lcov',
        subdir: 'report-lcov'
      }]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
