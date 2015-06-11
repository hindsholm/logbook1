/*global google: false */

angular.module('logbook')

    .controller('LogbookController', function logbookController($mdSidenav, uiGmapGoogleMapApi, googleChartApiPromise,
                                                                 TrackService, GeocoderService) {
        'use strict';

        var vm = this;
        vm.mapReady = false;
        vm.chartReady = false;
        vm.gpx = '';
        vm.gpxFiles = ['20150603.gpx', '20150605A.gpx', '20150605B.gpx', '20150606.gpx'].map(function (file) {
            return {
                file: file,
                name: file.replace(/(\d{4})(\d{2})(\d{2})(\w?)\.gpx/, '$1-$2-$3 $4')
            };
        });
        vm.tracks = [];

        function plotSpeed(tracks) {
            vm.chart = {
                type: 'LineChart',
                options: {
                    curveType: 'function',
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
                    if (point.speed === null || point.time > time + 60000) {
                        time = point.time;
                        vm.chart.data.addRow([new Date(time), point.speed]);
                    }
                });
            });
        }

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

        vm.toggleSidebar = function () {
            $mdSidenav('left').toggle();
        };

        vm.gpxSelected = function () {
            TrackService.loadGpx(vm.gpx).then(function (trackData) {
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

    });
