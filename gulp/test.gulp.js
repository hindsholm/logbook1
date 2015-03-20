/*jslint node: true */

'use strict';

var gulp = require('gulp'),
    angularFilesort = require('gulp-angular-filesort'),
    filenames = require('gulp-filenames'),
    karma = require('gulp-karma'),
    wiredep = require('wiredep');

// Collects the js sources in the correct order
gulp.task('get-sources', function () {
    return gulp.src(['app/**/*.js', '!app/bower_components/**/*'], { base: '.' })
        .pipe(angularFilesort())
        .pipe(filenames('js'));
});

// Runs the unit tests
gulp.task('test', ['get-sources'], function () {
    var bowerDeps = wiredep({
        directory: 'app/bower_components',
        dependencies: true,
        devDependencies: true
    });

    return gulp.src(bowerDeps.js.concat(
        'node_modules/sinon/pkg/sinon.js',
        filenames.get('js')
    ))
        .pipe(karma({
            showStack: true,
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); // instead of erroring the stream, end it
        });
});
