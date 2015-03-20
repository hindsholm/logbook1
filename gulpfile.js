/*eslint-env node */
/*eslint strict: [2, "global"] */

'use strict';

var gulp = require('gulp');

gulp.config = { module: 'logbook'};

// Require all our gulp files, which each register their tasks when called
require('require-dir')('./gulp');

// Register our default task
gulp.task('default', ['bower', 'js', 'fonts', 'lint', 'test', 'server', 'watch']);
gulp.task('dist:serve', ['dist', 'server:dist']);
