/*global google: false */

angular.module('logbook')

    .controller('LogbookController', function logbookController($mdSidenav, uiGmapGoogleMapApi, googleChartApiPromise,
                                                                 GpxService, TrackService, GeocoderService) {
        'use strict';

        var vm = this;
        vm.mapReady = false;
        vm.chartReady = false;
        vm.gpx = '';
        vm.gpxFiles = [];
        vm.tracks = [];

        function plotSpeed(tracks) {
            vm.chart = {
                type: 'LineChart',
                options: {
                    hAxis: {
                        format: 'HH:mm'
                    },
                    title: 'Boat Speed'
                },
                data: new google.visualization.DataTable({
                    cols: [
                        {id: 'time', label: 'Time', type: 'datetime'},
                        {id: 'speed', label: 'Speed', type: 'number'}
                    ]
                })
            };
            angular.forEach(tracks, function (track) {
                var time = 0;
                angular.forEach(track.points, function (point) {
                    if (point.speed === null || point.time > time + 10000) {
                        // at least 10 seconds between points
                        time = point.time;
                        vm.chart.data.addRow([new Date(time), point.speed]);
                    }
                });
            });
        }

        vm.toggleSidebar = function () {
            $mdSidenav('left').toggle();
        };

        vm.gpxSelected = function () {
            TrackService.loadGpx(vm.gpx.file).then(function (trackData) {
                var lastTrack;
                vm.tracks = trackData.tracks;

                // Fom - To
                lastTrack = vm.tracks[vm.tracks.length - 1];
                GeocoderService.reverse(vm.tracks[0].points[0]).then(function (place) {
                    vm.origin = place;
                });
                GeocoderService.reverse(lastTrack.points[lastTrack.points.length - 1]).then(function (place) {
                    vm.destination = place;
                });

                // Chart
                plotSpeed(vm.tracks);
            });
            $mdSidenav('left').close();
        };

        GpxService.list().then(function (files) {
            vm.gpxFiles = files;
        });

        uiGmapGoogleMapApi.then(function googleMapReady() {
            vm.mapReady = true;
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
        });

        googleChartApiPromise.then(function googleChartReady() {
            vm.chartReady = true;
        });

    });
