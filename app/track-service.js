/*global DOMParser: false, LatLon: false */

angular.module('logbook')

    .factory('TrackService', function ($http, $q) {
        'use strict';

        var DELTA_MIN = 0.003; // Minimumn distance between trackpoints in nautical miles

        function textContent(parent, tag, def) {
            var elms = parent.getElementsByTagName(tag);
            return elms.length > 0 ? elms[0].textContent : def;
        }

        function parseTrackPt(trkpt) {
            var tm = textContent(trkpt, 'time');
            return {
                time: tm ? Date.parse(tm) : 0,
                latlon: new LatLon(parseFloat(trkpt.getAttribute('lat')), parseFloat(trkpt.getAttribute('lon')))
            };
        }

        function parseTrackSegment(trkseg) {
            var i, cur, prev, delta, speed,
                trkpts = trkseg.getElementsByTagName('trkpt'),
                distance = 0,
                segment = [];

            for (i = 0; i < trkpts.length; i++) {
                cur = parseTrackPt(trkpts[i]);
                delta = prev ? prev.latlon.distanceTo(cur.latlon) / 1.852 : 0;
                if (i === 0 || delta > DELTA_MIN) {
                    speed = prev && cur.time > 0 ? 3600000 * delta / (cur.time - prev.time) : 0;
                    distance += delta;
                    segment.push({
                        time: cur.time,
                        latitude: cur.latlon.lat,
                        longitude: cur.latlon.lon,
                        distance: distance,
                        speed: speed
                    });
                    prev = cur;
                }
            }
            return segment;
        }

        // Returns an individual track
        function parseTrack(trk) {
            var i, path,
                segments = [],
                gpxSegments = trk.getElementsByTagName('trkseg');
            for (i = 0; i < gpxSegments.length; i++) {
                path = parseTrackSegment(gpxSegments[i]);
                segments.push({
                    id: i,
                    path: path,
                    start: path[0].time,
                    end: path[path.length - 1].time,
                    distance: path[path.length - 1].distance
                });
            }
            return {
                name: textContent(trk, 'name', ''),
                desc: textContent(trk, 'desc', ''),
                type: textContent(trk, 'type', ''),
                segments: segments
            };
        }

        // Returns a list of tracks found in gpx
        function parseGpxTracks(gpx) {
            var i, tracks = [],
                trk = gpx.documentElement.getElementsByTagName('trk');
            for (i = 0; i < trk.length; i++) {
                tracks.push(parseTrack(trk[i]));
            }
            return tracks;
        }

        function loadGpx(name) {
            var deferred = $q.defer();
            $http.get('tracks/' + name).success(function (data) {
                var gpx = new DOMParser().parseFromString(data, 'application/xml'),
                    tracks = parseGpxTracks(gpx);
                deferred.resolve({
                    tracks: tracks
                });
            });
            return deferred.promise;
        }

        return {
            loadGpx: loadGpx
        };

    });
