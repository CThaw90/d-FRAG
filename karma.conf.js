/**
 * Created by christhaw on 7/12/16.
 */
// Karma configuration
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-jquery', 'jasmine', 'requirejs'],

        // list of files / patterns to load in the browser
        files: [
            // test js
            {pattern: 'src/tests/**/*Test.js', included: false},
            {pattern: 'src/tests/fixture/json/**/*.json', included: false},
            {pattern: 'src/tests/fixture/html/**/*.html', included: false},
            {pattern: 'src/tests/fixture/js/**/*.js', included: false},

            // app js
            {pattern: 'src/main/components/**/*.jpeg', included: false},
            {pattern: 'src/main/components/**/*.png', included: false},
            {pattern: 'src/main/components/**/*.jpg', included: false},
            {pattern: 'src/main/components/**/*.js', included: false},
            {pattern: 'src/main/js/**/*.js', included: false},
            {pattern: 'src/main/js/*.js', included: false},

            // main test file
            'src/tests/main.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocessor matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'js/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['coverage', 'progress'],

        coverageReporter: {
            type: 'html',
            dir: 'reports/coverage/'
        },

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
        // available browser launchers: https://snpmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};