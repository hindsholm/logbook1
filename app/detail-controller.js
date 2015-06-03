/*global google: false */

angular.module('logbook')

    .controller('DetailController', function detailController($rootScope, $routeParams, $q, uiGmapGoogleMapApi,
                                               googleChartApiPromise, trackData) {
        'use strict';

        var vm = this;
        vm.tracks = trackData ? trackData.tracks : [];

        function createMap() {
            return {
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
        }

        function reverseGeocode(point) {
            var latlng = new google.maps.LatLng(point.latitude, point.longitude),
                geocoder = new google.maps.Geocoder(),
                deferred = $q.defer();

            function townName(addressComponents) {
                // Heuristics show that this is the best town name
                return addressComponents.length < 6 ? addressComponents[1].long_name : addressComponents[2].long_name;
            }

            geocoder.geocode({latLng: latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    deferred.resolve(townName(results[0].address_components));
                }
            });
            return deferred.promise;
        }

        function createChart() {
            return {
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
        }

        function plotSpeed(chart, tracks) {
            // Plot speed once for every minute
            angular.forEach(tracks, function (track) {
                var time = 0;
                angular.forEach(track.points, function (point) {
                    if (point.speed === null || point.time > time + 60000) {
                        time = point.time;
                        chart.data.addRow([new Date(time), point.speed]);
                    }
                });
            });
        }

        uiGmapGoogleMapApi.then(function googleMapReady() {
            // Google Maps ready
            var lastTrack = vm.tracks[vm.tracks.length - 1];
            vm.map = createMap();
            reverseGeocode(vm.tracks[0].points[0]).then(function (place) {
                vm.origin = place;
            });
            reverseGeocode(lastTrack.points[lastTrack.points.length - 1]).then(function (place) {
                vm.destination = place;
            });
        });

        googleChartApiPromise.then(function googleChartReady() {
            // Google Charts ready
            vm.chart = createChart();
            plotSpeed(vm.chart, vm.tracks);
        });

        $rootScope.$broadcast('selection', $routeParams.id);

    });
