'use strict';

var gulp = require('gulp'),
    complexity = require('gulp-complexity');

gulp.task('complexity', function () {
    return gulp.src(['app/**/*.js', '!app/bower_components/**/*', '!./**/*_test.js'])
        .pipe(complexity());
});
