'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    jslint = require('gulp-jslint');

// Runs JSLint on the js source
gulp.task('jslint', function () {
    return gulp.src(['app/**/*.js', 'gulp/*.js', 'gulpfile.js', '!app/bower_components/**/*', '!app/patch/**/*'])
        .pipe(jslint())
        .on('error', function (error) {
            console.error(String(error));
        });
});

gulp.task('lint', function () {
    return gulp.src(['app/**/*.js', 'gulp/*.js', 'gulpfile.js', '!app/bower_components/**/*', '!app/patch/**/*'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
