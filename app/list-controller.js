angular.module('logbook')

    .controller('ListController', function ($rootScope) {
        'use strict';
        var vm = this;
        vm.tracks = [
            { file: '20130714.gpx', name: '2013-07-14' },
            { file: '20130727.gpx', name: '2013-07-27' },
            { file: '20140715.gpx', name: '2014-07-15' },
            { file: '20140716.gpx', name: '2014-07-16' },
            { file: '20140717.gpx', name: '2014-07-17' },
            { file: '20140718.gpx', name: '2014-07-18' },
            { file: '20140719.gpx', name: '2014-07-19' },
            { file: '20140721.gpx', name: '2014-07-21' },
            { file: '20140722.gpx', name: '2014-07-22' },
            { file: '20140724.gpx', name: '2014-07-24' },
            { file: '20140725.gpx', name: '2014-07-25' },
            { file: '20140726.gpx', name: '2014-07-26' },
            { file: '20140727.gpx', name: '2014-07-27' },
            { file: '20140728.gpx', name: '2014-07-28' },
            { file: '20140729.gpx', name: '2014-07-29' },
            { file: '20150603.gpx', name: '2015-06-03' },
            { file: '20150605A.gpx', name: '2015-06-05 A' },
            { file: '20150605B.gpx', name: '2015-06-05 B' },
            { file: '20150606.gpx', name: '2015-06-06' }
        ];

        /*jslint unparam: true */
        $rootScope.$on('selection', function (e, file) {
            vm.tracks.forEach(function (track) {
                track.selected = (track.file === file);
            });
        });

    });
