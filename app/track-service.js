/*global DOMParser: false, LatLon: false */

angular.module('logbook')

    .factory('TrackService', function ($http, $log, $q) {
        'use strict';

        function parseTrackPt(trkpt) {
            var timeElm = trkpt.getElementsByTagName('time');
            return {
                time: timeElm.length > 0 ? Date.parse(timeElm[0].textContent) : 0,
                latlon: new LatLon(parseFloat(trkpt.getAttribute('lat')), parseFloat(trkpt.getAttribute('lon')))
            };
        }

        function parseTrackSegment(trkseg) {
            var i, cur, prev, dist, speed,
                trkpts = trkseg.getElementsByTagName('trkpt'),
                total = 0,
                segment = [];

            for (i = 0; i < trkpts.length; i++) {
                cur = parseTrackPt(trkpts[i]);
                dist = prev ? prev.latlon.distanceTo(cur.latlon) / 1.852 : 0;
                speed = prev && cur.time > 0 ? 3600000 * dist / (cur.time - prev.time) : 0;
                segment.push({
                    time: cur.time,
                    latitude: cur.latlon.lat,
                    longitude: cur.latlon.lon,
                    dist: dist,
                    speed: speed
                });
                total += dist;
                prev = cur;
            }
            $log.info(trkpts.length + ' trackpoints. ' + total + ' nm travelled.');
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

        function loadGpx(name) {
            var deferred = $q.defer();
            $http.get('tracks/' + name).success(function (data) {
                var gpx = new DOMParser().parseFromString(data, 'application/xml'),
                    tracks = parseGpxTracks(gpx);
                deferred.resolve({
                    tracks: tracks,
                });
            });
            return deferred.promise;
        }

        return {
            loadGpx: loadGpx
        };

    });
