/* global DOMParser: false, LatLon: false */

angular.module('logbook')

    .factory('TrackService', function ($http, $q, TRACK_PATH, $log) {
        'use strict';

        var DELTA_MIN = 0.003,       // Minimumn distance between trackpoints in nautical miles
            SPEED_MAX = 12,          // Maximum speed in knots
            SPEED_INCREASE_MAX = 5;  // Maximum speed increase in knots

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

        function parseTrackSegment(trkseg, distance) {
            var trkpts = trkseg.getElementsByTagName('trkpt'),
                segment = [],
                previous;
            angular.forEach(trkpts, function (trkpt) {
                var current = parseTrackPt(trkpt),
                    usePoint = false,
                    delta;
                if (!previous) {
                    current.speed = null;
                    usePoint = true;
                } else {
                    delta = previous.latlon.distanceTo(current.latlon) / 1852;
                    if (delta > DELTA_MIN) {
                        current.speed = current.time > 0 ? 3600000 * delta / (current.time - previous.time) : null;
                        if (current.speed !== null) {
                            if (current.speed > SPEED_MAX) {
                                $log.warn('Speed too high: ' + Math.round(current.speed) + ' kn at ' + new Date(current.time));
                            } else if (previous.speed !== null && current.speed > previous.speed + SPEED_INCREASE_MAX) {
                                $log.warn('Speed increase too high: ' + Math.round(current.speed - previous.speed) + ' at ' +
                                    new Date(current.time));
                            } else {
                                distance += delta;
                                usePoint = true;
                            }
                        } else {
                            distance += delta;
                            usePoint = true;
                        }
                    }
                }
                if (usePoint) {
                    segment.push({
                        time: current.time,
                        latitude: current.latlon.lat,
                        longitude: current.latlon.lon,
                        distance: distance,
                        speed: current.speed
                    });
                    previous = current;
                }
            });
            return segment;
        }

        // Returns an individual track with its segments collapsed into one
        function parseTrack(trk) {
            var segment,
                distance = 0,
                points = [],
                gpxSegments = trk.getElementsByTagName('trkseg');
            angular.forEach(gpxSegments, function (gpxSegment) {
                segment = parseTrackSegment(gpxSegment, distance);
                Array.prototype.push.apply(points, segment);
                distance = segment[segment.length - 1].distance;
            });
            return {
                name: textContent(trk, 'name', ''),
                desc: textContent(trk, 'desc', ''),
                start: points[0].time,
                end: points[points.length - 1].time,
                distance: points[points.length - 1].distance,
                points: points
            };
        }

        // Returns a list of tracks found in gpx
        function parseGpxTracks(gpx) {
            var tracks = [],
                trk = gpx.documentElement.getElementsByTagName('trk');
            angular.forEach(trk, function (t) {
                tracks.push(parseTrack(t));
            });
            return tracks;
        }

        function loadGpx(name) {
            return $q(function (resolve) {
                var path = name.charAt(0) === '/' ? name : TRACK_PATH + name;
                $http.get(path).success(function (data) {
                    var gpx = new DOMParser().parseFromString(data, 'application/xml'),
                        tracks = parseGpxTracks(gpx),
                        distance = tracks.reduce(function (sum, track) {
                            return sum + track.distance;
                        }, 0),
                        pointCount = tracks.reduce(function (sum, track) {
                            return sum + track.points.length;
                        }, 0);
                    resolve({
                        tracks: tracks,
                        distance: distance,
                        pointCount: pointCount
                    });
                });
            });
        }

        return {
            loadGpx: loadGpx
        };

    });
