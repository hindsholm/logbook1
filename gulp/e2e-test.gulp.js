/*jslint node: true */

'use strict';

var gulp = require('gulp'),
    protractor = require("gulp-protractor").protractor;

// Runs end 2 end tests in browser
gulp.task('e2e-test', function () {
    return gulp.src(["./e2e-tests/**/*_e2e-test.js"])
        .pipe(protractor({
            configFile: "e2e-tests/protractor-config.js",
            args: ['--baseUrl', 'http://127.0.0.1:8080']
        }))
        .on('error', function (e) {
            throw e;
        });
});