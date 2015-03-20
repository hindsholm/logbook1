/*jslint node: true */

'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('server', function () {
    connect.server({
        root: ['app', 'build/tmp'],
        livereload: true
    });
});

gulp.task('server:dist', function () {
    connect.server({
        root: 'build/dist'
    });
});
