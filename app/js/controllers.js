angular.module('logbook.controllers', []).
    controller('ListCtrl', [function () {
        'use strict';

    }])
    .controller('DetailCtrl', ['$scope', '$http', function ($scope, $http) {
        'use strict';

        function trackSegmentToArray(segment) {
            var pointarray = [], lastlon = 200, lastlat = 100, lon, lat, latdiff, londiff, i,
                trackpoints = segment.getElementsByTagName("trkpt"),
                deltaSquared = 0.0001 * 0.0001;

            for (i = 0; i < trackpoints.length; i++) {
                lon = parseFloat(trackpoints[i].getAttribute("lon"));
                lat = parseFloat(trackpoints[i].getAttribute("lat"));

                // Verify that this is far enough away from the last point to be used.
                latdiff = lat - lastlat;
                londiff = lon - lastlon;
                if (latdiff * latdiff + londiff * londiff > deltaSquared) {
                    lastlon = lon;
                    lastlat = lat;
                    pointarray.push({ lat: lastlat, lng: lastlon});
                }

            }
            return pointarray;
        }

        function addTrackSegmentsToMap(track) {
            var i, segments = track.getElementsByTagName("trkseg");
            for (i = 0; i < segments.length; i++) {
                $scope.track.push({ id: i, path: trackSegmentToArray(segments[i]) });
            }
        }

        function addTracksToMap(gpx) {
            var i, tracks = gpx.documentElement.getElementsByTagName("trk");
            $scope.track = [];
            for (i = 0; i < tracks.length; i++) {
                addTrackSegmentsToMap(tracks[i]);
            }
        }

        function loadGpx(name) {
            $http.get(name).success(function(data) {
                var gpx = new DOMParser().parseFromString(data, 'application/xml');
                addTracksToMap(gpx);
            });
        }

        $scope.options = {
            map: {
                center: new google.maps.LatLng(56.7, 10.1),
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.HYBRID
            },
            line: {
                strokeColor: '#ff0000',
                strokeWeight: 2
            }
        };

        loadGpx('logs/20130714.gpx');

    }]);
