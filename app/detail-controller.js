/*global google: false */

angular.module('logbook')

    .controller('DetailController', function ($routeParams, uiGmapGoogleMapApi, TrackService) {
        'use strict';

        var vm = this;

        vm.map = {
            center: {
                latitude: 56.2,
                longitude: 10.1
            },
            zoom: 7,
            options: {
            },
            events: {
            }
        };

        uiGmapGoogleMapApi.then(function () {
            // Google Maps is now ready
            vm.map.options.mapTypeId = google.maps.MapTypeId.HYBRID;
        });

        if ($routeParams.id) {
            TrackService.loadGpx($routeParams.id).then(function (trackData) {
                vm.tracks = trackData.tracks;
            });
        }

    });
