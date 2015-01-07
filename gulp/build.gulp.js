/*jslint node: true, regexp: true */

'use strict';

var gulp = require('gulp'),
    angularFilesort = require('gulp-angular-filesort'),
    appcache = require('gulp-appcache'),
    csso = require('gulp-csso'),
    filter = require('gulp-filter'),
    gulpif = require('gulp-if'),
    inject = require('gulp-inject'),
    mainBowerFiles = require('main-bower-files'),
    minifyHtml = require('gulp-minify-html'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngHtml2js = require('gulp-ng-html2js'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    wiredep = require('wiredep').stream;

gulp.task('bower', function () {
    return gulp.src('app/index.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('js', function () {
    return gulp.src('app/index.html')
        .pipe(inject(gulp.src(['app/**/*.js', '!app/bower_components/**/*', '!**/*_test.js'])
                     .pipe(angularFilesort()), {relative: true}))
        .pipe(gulp.dest('app'));
});

gulp.task('build-styles', function () {
    return gulp.src(['app/**/*.scss', '!app/bower_components/**/*'])
        .pipe(size())
        .pipe(sass())
        .pipe(gulp.dest('build/tmp/styles'));
});

gulp.task('partials', function () {
    return gulp.src(['app/**/*.html', '!app/index.html', '!app/bower_components/**/*'])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2js({
            moduleName: gulp.config.module
        }))
        .pipe(gulp.dest('build/tmp'))
        .pipe(size());
});

gulp.task('fonts', function () {
    return gulp.src(mainBowerFiles())
        .pipe(filter('**/*.{eot,svg,ttf,woff}'))
        .pipe(gulp.dest('build/tmp/fonts'))
        .pipe(gulp.dest('build/dist/fonts'))
        .pipe(size());
});

gulp.task('images', function () {
    return gulp.src(['app/**/img/**/*', '!app/bower_components/**/*'])
        .pipe(gulp.dest('build/dist'))
        .pipe(size());
});

gulp.task('build', ['bower', 'js', 'images', 'fonts', 'build-styles', 'partials'], function () {
    var assets = useref.assets();

    return gulp.src('app/index.html')
        .pipe(inject(gulp.src('build/tmp/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '..'
        }))
        .pipe(assets)
        .pipe(rev())
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulpif('*.html', minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe(gulp.dest('build/dist'))
        .pipe(size());
});

// Creates HTML5 AppCache manifest
gulp.task('appcache', ['build'], function () {
    gulp.src(['build/dist/**/*'])
        .pipe(appcache({
            filename: 'app.manifest',
            exclude: 'app.manifest',
            timestamp: true
        }))
        .pipe(gulp.dest('build/dist'));
    gulp.src(['build/dist/index.html'])
        .pipe(replace(/<html /, '<html manifest="app.manifest" '))
        .pipe(gulp.dest('build/dist'));
});

gulp.task('dist', ['appcache']);
