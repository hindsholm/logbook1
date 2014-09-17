/*jslint plusplus: true */
/*global angular: false, google: false, DOMParser: false */

angular.module('logbook.controllers', ['google-maps'])

    .controller('ListCtrl', [
        function () {
            'use strict';
        }])

    .controller('DetailCtrl', ['$scope', '$http', '$log',
        function ($scope, $http, $log) {
            'use strict';

            function parseTrackSegment(trkseg) {
                var i, trkpts = trkseg.getElementsByTagName('trkpt'),
                    lat, lng, lastlat = 100,
                    lastlng = 200,
                    deltaSquared = 0.0001 * 0.0001,
                    segment = [];

                for (i = 0; i < trkpts.length; i++) {
                    lat = parseFloat(trkpts[i].getAttribute('lat'));
                    lng = parseFloat(trkpts[i].getAttribute('lon'));

                    // Verify that this is far enough away from the last point to be used.
                    if (Math.pow(lat - lastlat, 2) + Math.pow(lng - lastlng, 2) > deltaSquared) {
                        lastlat = lat;
                        lastlng = lng;
                        segment.push({
                            latitude: lastlat,
                            longitude: lastlng
                        });
                    }

                }
                $log.info(segment.length + ' trackpoints out of ' + trkpts.length);
                return segment;
            }

            function parseTrack(trk) {
                var i, track = [],
                    segments = trk.getElementsByTagName('trkseg');
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
                    trk = gpx.documentElement.getElementsByTagName('trk');
                for (i = 0; i < trk.length; i++) {
                    tracks = tracks.concat(parseTrack(trk[i]));
                }
                return tracks;
            }

            function calculateCenter(tracks) {
                var lats = [],
                    lngs = [];
                tracks.forEach(function (track) {
                    lats = lats.concat(track.path.map(function (point) {
                        return point.latitude;
                    }));
                    lngs = lngs.concat(track.path.map(function (point) {
                        return point.longitude;
                    }));
                });
                return {
                    latitude: (Math.min.apply(null, lats) + Math.max.apply(null, lats)) / 2,
                    longitude: (Math.min.apply(null, lngs) + Math.max.apply(null, lngs)) / 2
                };
            }

            function loadGpx(name) {
                $http.get(name).success(function (data) {
                    var gpx = new DOMParser().parseFromString(data, 'application/xml');
                    $scope.tracks = parseGpxTracks(gpx);
                    $scope.map.center = calculateCenter($scope.tracks);
                });
            }

            $scope.map = {
                center: {
                    latitude: 56.7,
                    longitude: 10.1
                },
                zoom: 10,
                options: { mapTypeId: google.maps.MapTypeId.HYBRID},
            };

            loadGpx('tracks/20140728.gpx');

        }]);
