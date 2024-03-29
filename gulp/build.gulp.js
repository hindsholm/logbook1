'use strict';

var gulp = require('gulp'),
    angularFilesort = require('gulp-angular-filesort'),
    appcache = require('gulp-appcache'),
    csso = require('gulp-csso'),
    filter = require('gulp-filter'),
    gulpIf = require('gulp-if'),
    gulpInject = require('gulp-inject'),
    mainBowerFiles = require('main-bower-files'),
    minifyHtml = require('gulp-minify-html'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngHtml2js = require('gulp-ng-html2js'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
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
    var target = gulp.src('./app/index.html'),
        sources = gulp.src(['./app/**/*.js', '!./app/bower_components/**/*', '!**/*_test.js']);
    return target
        .pipe(gulpInject(sources.pipe(angularFilesort()), {relative: true}))
        .pipe(gulp.dest('app'));
});

gulp.task('css', function () {
    var target = gulp.src('./app/index.html'),
        sources = gulp.src(['./app/**/*.css', '!./app/bower_components/**/*'], {read: false});
    return target
        .pipe(gulpInject(sources, {relative: true}))
        .pipe(gulp.dest('./app'));
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

// Builds the application in build/dist
gulp.task('build', ['bower', 'js', 'css', 'images', 'fonts', 'partials'], function () {
    var assets = useref.assets();

    return gulp.src('app/index.html')
        .pipe(gulpInject(gulp.src('build/tmp/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '..'
        }))
        .pipe(assets)
        .pipe(rev())
        .pipe(gulpIf('*.js', ngAnnotate()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', csso()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulpIf('*.html', minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe(gulp.dest('build/dist'))
        .pipe(size());
});

// Copies static files to build/dist
gulp.task('static', function () {
    gulp.src('app/assets/**')
        .pipe(gulp.dest('build/dist/assets'));
});

// Creates HTML5 AppCache manifest
gulp.task('appcache', ['build', 'static'], function () {
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
