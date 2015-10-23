/* global beforeEach, describe, expect, inject, it, module */
describe('Logbook Track Service', function () {

    'use strict';

    var RESPONSE =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<gpx>' +
        '<trk>' +
        '<name><![CDATA[track_name]]></name>' +
        '<desc><![CDATA[track_desc]]></desc>' +
        '<trkseg>' +
        '<trkpt lat="55.05" lon="10.16"><time>2014-07-22T07:02:05.412Z</time></trkpt>' +
        '<trkpt lat="55.06" lon="10.16"><time>2014-07-22T07:08:15.900Z</time></trkpt>' +
        '<trkpt lat="55.06004" lon="10.16"><time>2014-07-22T07:08:45.900Z</time></trkpt>' + // delta < DELTA_MIN
        '<trkpt lat="55.07" lon="10.16"><time>2014-07-22T07:14:24.876Z</time></trkpt>' +
        '</trkseg>' +
        '<trkseg>' +
        '<trkpt lat="55.07" lon="10.17"><time>2014-07-22T07:22:45.412Z</time></trkpt>' +
        '<trkpt lat="55.07" lon="10.18"><time>2014-07-22T07:28:55.900Z</time></trkpt>' +
        '<trkpt lat="55.17" lon="10.18"><time>2014-07-22T07:29:55.900Z</time></trkpt>' + // speed too high
        '<trkpt lat="55.07" lon="10.19"><time>2014-07-22T07:34:05.876Z</time></trkpt>' +
        '</trkseg>' +
        '</trk>' +
        '</gpx>';

    describe('TrackService', function () {

        beforeEach(function () {
            module('logbook');
        });

        it('should be loaded', function () {
            inject(function (TrackService) {
                expect(TrackService).toBeDefined();
            });
        });

        it('should parse gpx track', function () {
            inject(function (TrackService, $httpBackend, TRACK_PATH) {
                $httpBackend
                    .when('GET', TRACK_PATH + '20140722.gpx')
                    .respond(RESPONSE);
                TrackService.loadGpx('20140722.gpx').then(function (data) {
                    var track = data.tracks[0];
                    expect(data.tracks.length).toBe(1);
                    expect(track.name).toBe('track_name');
                    expect(track.desc).toBe('track_desc');
                    expect(track.start).toBe(Date.parse('2014-07-22T07:02:05.412Z'));
                    expect(track.end).toBe(Date.parse('2014-07-22T07:34:05.876Z'));
                    expect(track.distance).toBeCloseTo(1.888);
                    expect(track.points.length).toBe(6);
                    expect(track.points[0].speed).toBeNull();
                    expect(track.points[1].speed).not.toBeNull();
                    expect(track.points[3].speed).toBeNull();
                });
                $httpBackend.flush();
            });
        });

    });

});
