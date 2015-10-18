'use strict';

var gulp = require('gulp'),
    jscs = require('gulp-jscs');

gulp.task('codestyle', function () {
    return gulp.src(['app/**/*.js', '!app/bower_components/**/*'])
        .pipe(jscs());
});
