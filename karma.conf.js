/*global module */

// Karma configuration
// Generated on Tue Oct 21 2014 22:40:14 GMT+0200 (CEST)

module.exports = function (config) {
    'use strict';
    config.set({
        // frameworks to use
        frameworks: ['jasmine'],
        preprocessors: {
            // source files, that you want to generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/!(bower_components)/!(patch)/**/!(*_test).js': ['coverage']
        },
        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'junit', 'coverage'],
        junitReporter: {
            outputFile: 'build/test-results.xml'
        },
        coverageReporter: {
            type: 'cobertura',
            dir: 'build/coverage/'
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


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
