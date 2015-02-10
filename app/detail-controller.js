/*global google: false */

angular.module('logbook')

    .controller('DetailController', function ($rootScope, $routeParams, uiGmapGoogleMapApi,
                                               googleChartApiPromise, trackData) {
        'use strict';

        var vm = this;
        vm.tracks = trackData ? trackData.tracks : [];

        uiGmapGoogleMapApi.then(function () {
            // Google Maps ready
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

        googleChartApiPromise.then(function () {
            // Google Charts ready
            var i, k, track, point, time;
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
            for (i = 0; i < vm.tracks.length; ++i) {
                track = vm.tracks[i];
                for (k = 0; k < track.points.length; ++k) {
                    point = track.points[k];
                    if (point.speed === null || point.time > time + 60000) {
                        time = point.time;
                        vm.chart.data.addRow([new Date(time), point.speed]);
                    }
                }
            }
        });

        $rootScope.$broadcast('selection', $routeParams.id);

    });
