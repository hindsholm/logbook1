module.exports = function(config) {
    config.set({
        basePath: '../../',
        files: [
            'main/webapp/lib/angular/angular.js',
            'main/webapp/lib/angular/angular-*.js',
            'test/javascript/lib/angular/angular-mocks.js',
            'main/webapp/js/**/*.js',
            'test/javascript/unit/**/*.js'
        ],
        exclude: [
            'main/webapp/lib/angular/angular-loader.js',
            'main/webapp/lib/angular/*.min.js',
            'main/webapp/lib/angular/angular-scenario.js'
        ],
        autoWatch: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],
        junitReporter: {
            outputFile: '../target/karma/unit.xml',
            suite: 'unit'
        }

    });
};
