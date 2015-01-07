/*jslint node: true */

'use strict';

var gulp = require('gulp');

gulp.config = { module: 'logbook'};

// Require all our gulp files, which each register their tasks when called
require('require-dir')('./gulp');

// Register our default task
gulp.task('default', ['bower', 'js', 'build-styles', 'fonts', 'server', 'watch']);
gulp.task('dist:serve', ['dist', 'server:dist']);
