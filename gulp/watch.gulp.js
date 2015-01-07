/*jslint node: true */

'use strict';

var gulp        = require('gulp'),
    livereload  = require('gulp-livereload');

// Watches the source tree for changes
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['*.js', 'gulp/*.js'], ['lint']);
    gulp.watch(['app/**/*.js', '!app/bower_components/**/*'], ['lint', 'test']);
    gulp.watch(['app/**/*.scss', '!app/bower_components/**/*'], ['build-styles']);
    gulp.watch(['app/**/*.js', '!app/bower_components/**/*'], livereload.changed);
    gulp.watch(['app/**/*.html', '!app/bower_components/**/*'], livereload.changed);
    gulp.watch(['build/tmp/**/*.css'], livereload.changed);
});
