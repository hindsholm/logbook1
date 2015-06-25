/*global beforeEach, describe, expect, inject, it, module */
describe('Logbook Track Service', function () {

    'use strict';

    var RESPONSE =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<gpx>' +
        '<trk>' +
        '<name><![CDATA[track_name]]></name>' +
        '<desc><![CDATA[track_desc]]></desc>' +
        '<type><![CDATA[track_type]]></type>' +
        '<trkseg>' +
        '<trkpt lat="55.053037" lon="10.162966"><time>2014-07-22T07:02:05.412Z</time></trkpt>' +
        '<trkpt lat="55.043121" lon="10.163604"><time>2014-07-22T07:02:32.900Z</time></trkpt>' +
        '<trkpt lat="55.033114" lon="10.163750"><time>2014-07-22T07:02:36.876Z</time></trkpt>' +
        '</trkseg>' +
        '<trkseg>' +
        '<trkpt lat="55.153037" lon="10.162966"><time>2014-07-22T07:02:45.412Z</time></trkpt>' +
        '<trkpt lat="55.143121" lon="10.163604"><time>2014-07-22T07:03:32.900Z</time></trkpt>' +
        '<trkpt lat="55.133114" lon="10.163750"><time>2014-07-22T07:04:36.876Z</time></trkpt>' +
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
                    expect(track.type).toBe('track_type');
                    expect(track.start).toBe(Date.parse('2014-07-22T07:02:05.412Z'));
                    expect(track.end).toBe(Date.parse('2014-07-22T07:04:36.876Z'));
                    expect(track.distance).toBeCloseTo(2.39);
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
