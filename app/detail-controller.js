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
            var i, j, k, track, segment, time;
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
                for (j = 0; j < track.segments.length; ++j) {
                    segment = track.segments[j];
                    // speed is always 0 at point 0, so start from point 1
                    for (k = 1; k < segment.path.length; k += 10) {
                        time = segment.path[k].time;
                        vm.chart.data.addRow([new Date(time), segment.path[k].speed]);
                    }
                    // a null value makes the graph discontinuous between segments
                    vm.chart.data.addRow([new Date(time + 1000), null]);
                }
            }
        });

        $rootScope.$broadcast('selection', $routeParams.id);

    });
