angular.module('logbook')

    .controller('ListController', function ($rootScope) {
        'use strict';
        var vm = this;
        vm.tracks = [
            { file: '20130714.gpx' },
            { file: '20130727.gpx' },
            { file: '20140715.gpx' },
            { file: '20140716.gpx' },
            { file: '20140717.gpx' },
            { file: '20140718.gpx' },
            { file: '20140719.gpx' },
            { file: '20140721.gpx' },
            { file: '20140722.gpx' },
            { file: '20140724.gpx' },
            { file: '20140725.gpx' },
            { file: '20140726.gpx' },
            { file: '20140727.gpx' },
            { file: '20140728.gpx' },
            { file: '20140729.gpx' }
        ];

        $rootScope.$on('selection', function (e, file) {
            vm.tracks.forEach(function (track) {
                track.selected = (track.file === file);
            });
        });

    });
