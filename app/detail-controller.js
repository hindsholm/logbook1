/*global google: false */

angular.module('logbook')

    .controller('DetailController', function detailController($rootScope, $routeParams, uiGmapGoogleMapApi,
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

        function plotSpeed(chart) {
            // Plot speed once for every minute
            angular.forEach(vm.tracks, function (track) {
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
            vm.map = createMap();
        });

        googleChartApiPromise.then(function googleChartReady() {
            // Google Charts ready
            vm.chart = createChart();
            plotSpeed(vm.chart);
        });

        $rootScope.$broadcast('selection', $routeParams.id);

    });
