/*jslint node: true */

'use strict';

var gulp = require('gulp'),
    del = require('del');

// Cleans the dist directory
gulp.task('clean', function (cb) {
    del(['build/dist', 'build/tmp'], cb);
});
