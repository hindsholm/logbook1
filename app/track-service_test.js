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
                    '<trkpt lat="55.053037" lon="10.162966">' +
                        '<time>2014-07-22T07:02:05.412Z</time>' +
                    '</trkpt>' +
                    '<trkpt lat="55.043121" lon="10.163604">' +
                        '<time>2014-07-22T07:02:32.900Z</time>' +
                    '</trkpt>' +
                    '<trkpt lat="55.033114" lon="10.16375">' +
                        '<time>2014-07-22T07:02:36.876Z</time>' +
                    '</trkpt>' +
                '</trkseg>' +
                '<trkseg>' +
                    '<trkpt lat="55.153037" lon="10.162966">' +
                        '<time>2014-07-22T07:02:05.412Z</time>' +
                    '</trkpt>' +
                    '<trkpt lat="55.143121" lon="10.163604">' +
                        '<time>2014-07-22T07:02:32.900Z</time>' +
                    '</trkpt>' +
                    '<trkpt lat="55.133114" lon="10.16375">' +
                        '<time>2014-07-22T07:02:36.876Z</time>' +
                    '</trkpt>' +
                '</trkseg>' +
            '</trk>' +
        '</gpx>';

    describe('TrackService', function () {

        beforeEach(function () {
            module('logbook');
        });

        it('should be loaded', function () {
            inject(['TrackService', function (service) {
                expect(service).toBeDefined();
            }]);
        });

        it('should parse gpx track', function () {
            inject(['TrackService', '$httpBackend', function (service, backend) {
                backend
                    .when('GET', 'tracks/20140722.gpx')
                    .respond(RESPONSE);
                service.loadGpx('20140722.gpx').then(function (data) {
                    expect(data.tracks.length).toBe(1);
                    expect(data.tracks[0].name).toBe('track_name');
                    expect(data.tracks[0].desc).toBe('track_desc');
                });
                backend.flush();
            }]);
        });

    });

});
