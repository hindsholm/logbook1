/*global beforeEach, describe, expect, inject, it, module */
describe('Logbook GPX Service', function () {

    'use strict';

    var RESPONSE =
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">' +
        '<html>' +
        '<head></head>' +
        '<body>' +
        '<ul><li><a href="/"> Parent Directory</a></li>' +
        '<li><a href="2015-07-16.gpx"> 20140716.gpx</a></li>' +
        '<li><a href="20150714.gpx"> 20130714.gpx</a></li>' +
        '<li><a href="mytrack.gpx"> mytrack.gpx</a></li>' +
        '<li><a href="20150715 A.gpx"> 20130727.gpx</a></li>' +
        '<li><a href="20150715 B.gpx"> 20140715.gpx</a></li>' +
        '<li><a href="not-a-gpx.txt"> not-a-gpx.txt</a></li>' +
        '</ul>' +
        '</body>' +
        '</html>';

    describe('GpxService', function () {

        beforeEach(function () {
            module('logbook');
        });

        it('should be loaded', function () {
            inject(['GpxService', function (service) {
                expect(service).toBeDefined();
            }]);
        });

        it('should list gpx files', function () {
            inject(['GpxService', '$httpBackend', function (service, backend) {
                backend
                    .when('GET', '/tracks')
                    .respond(RESPONSE);
                service.list().then(function (data) {
                    expect(data.length).toBe(5);
                    expect(data[0]).toEqual({file: '20150714.gpx', name: '2015-07-14'});
                    expect(data[1]).toEqual({file: '20150715 A.gpx', name: '2015-07-15 A'});
                    expect(data[2]).toEqual({file: '20150715 B.gpx', name: '2015-07-15 B'});
                    expect(data[3]).toEqual({file: '2015-07-16.gpx', name: '2015-07-16'});
                    expect(data[4]).toEqual({file: 'mytrack.gpx', name: 'mytrack'});
                });
                backend.flush();
            }]);
        });

    });

});
