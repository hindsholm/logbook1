/*global google: false */

angular.module('logbook')

    .controller('DetailController', function ($routeParams, TrackService) {
        'use strict';

        var vm = this;

        vm.map = {
            center: {
                latitude: 56.2,
                longitude: 10.1
            },
            zoom: 7,
            options: {
                mapTypeId: google.maps.MapTypeId.HYBRID
            },
            events: {
            }
        };

        TrackService.loadGpx($routeParams.id).then(function (trackData) {
            vm.tracks = trackData.tracks;
        });

    });
