/*jslint node: true */

'use strict';

var gulp    = require('gulp'),
    jslint  = require('gulp-jslint');

// Runs JSLint on the js source
gulp.task('lint', function () {
    return gulp.src(['app/**/*.js', 'gulp/*.js', 'gulpfile.js', '!app/bower_components/**/*', '!app/patch/**/*'])
        .pipe(jslint())
        .on('error', function (error) {
            console.error(String(error));
        });
});
