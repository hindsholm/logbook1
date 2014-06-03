/*jslint plusplus: true */
/*global angular: false, console: false, google: false, DOMParser: false */

angular.module('logbook.controllers', [])

    .controller('ListCtrl', [
        function () {
            'use strict';
        }])

    .controller('DetailCtrl', ['$scope', '$http',
        function ($scope, $http) {
            'use strict';

            function parseTrackSegment(trkseg) {
                var i, trkpts = trkseg.getElementsByTagName("trkpt"),
                    lat, lng, lastlat = 100,
                    lastlng = 200,
                    deltaSquared = 0.0001 * 0.0001,
                    segment = [];

                for (i = 0; i < trkpts.length; i++) {
                    lat = parseFloat(trkpts[i].getAttribute("lat"));
                    lng = parseFloat(trkpts[i].getAttribute("lon"));

                    // Verify that this is far enough away from the last point to be used.
                    if (Math.pow(lat - lastlat, 2) + Math.pow(lng - lastlng, 2) > deltaSquared) {
                        lastlat = lat;
                        lastlng = lng;
                        segment.push({
                            lat: lastlat,
                            lng: lastlng
                        });
                    }

                }
                return segment;
            }

            function parseTrack(trk) {
                var i, track = [],
                    segments = trk.getElementsByTagName("trkseg");
                for (i = 0; i < segments.length; i++) {
                    track.push({
                        id: i,
                        path: parseTrackSegment(segments[i])
                    });
                }
                return track;
            }

            function parseGpxTracks(gpx) {
                var i, tracks = [],
                    trk = gpx.documentElement.getElementsByTagName("trk");
                for (i = 0; i < trk.length; i++) {
                    tracks = tracks.concat(parseTrack(trk[i]));
                }
                return tracks;
            }

            function calculateBounds(tracks) {
                var lats = [],
                    lngs = [],
                    sw,
                    ne;
                tracks.forEach(function (track) {
                    lats = lats.concat(track.path.map(function (point) {
                        return point.lat;
                    }));
                    lngs = lngs.concat(track.path.map(function (point) {
                        return point.lng;
                    }));
                });
                sw = new google.maps.LatLng(Math.min.apply(null, lats), Math.min.apply(null, lngs));
                ne = new google.maps.LatLng(Math.max.apply(null, lats), Math.max.apply(null, lngs));
                return new google.maps.LatLngBounds(sw, ne);
            }

            function loadGpx(name) {
                $http.get(name).success(function (data) {
                    var gpx = new DOMParser().parseFromString(data, 'application/xml');
                    $scope.tracks = parseGpxTracks(gpx);
                    $scope.bounds = calculateBounds($scope.tracks);
                    $scope.options.map.center = $scope.bounds.getCenter();
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