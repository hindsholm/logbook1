angular.module('logbook.controllers', []).
    controller('ListCtrl', [function () {
        'use strict';

    }])
    .controller('DetailCtrl', ['$scope', '$http', function ($scope, $http) {
        'use strict';

        function parseTrackSegment(trkseg) {
            var segment = [], lastlng = 200, lastlat = 100, lng, lat, i,
                trkpts = trkseg.getElementsByTagName("trkpt"),
                deltaSquared = 0.0001 * 0.0001;

            for (i = 0; i < trkpts.length; i++) {
                lat = parseFloat(trkpts[i].getAttribute("lat"));
                lng = parseFloat(trkpts[i].getAttribute("lon"));

                // Verify that this is far enough away from the last point to be used.
                if (Math.pow(lat - lastlat, 2) + Math.pow(lng - lastlng, 2) > deltaSquared) {
                    lastlat = lat;
                    lastlng = lng;
                    segment.push({ lat: lastlat, lng: lastlng});
                }

            }
            return segment;
        }

        function parseTrack(trk) {
            var i, track = [], segments = trk.getElementsByTagName("trkseg");
            for (i = 0; i < segments.length; i++) {
                track.push({ id: i, path: parseTrackSegment(segments[i]) });
            }
            return track;
        }

        function parseGpxTracks(gpx) {
            var i, tracks = [], trk = gpx.documentElement.getElementsByTagName("trk");
            for (i = 0; i < trk.length; i++) {
                tracks = tracks.concat(parseTrack(trk[i]));
            }
            return tracks;
        }

        function loadGpx(name) {
            $http.get(name).success(function (data) {
                var gpx = new DOMParser().parseFromString(data, 'application/xml');
                $scope.tracks = parseGpxTracks(gpx);
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
