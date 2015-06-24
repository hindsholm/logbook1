/*global DOMParser: false; */

angular.module('logbook')

    .factory('GpxService', function ($http, $q) {
        'use strict';

        function list() {
            var deferred = $q.defer();
            // TODO: create '/tracks' constant
            $http.get('/tracks').success(function (data) {
                var dom = new DOMParser().parseFromString(data, 'text/html'),
                    gpxs = [];
                angular.forEach(dom.links, function (link) {
                    var href = link.getAttribute('href'),
                        isGpx = href.match(/([^/]+)\.gpx$/);
                    if (isGpx) {
                        gpxs.push({
                            file: href,
                            name: isGpx[1].replace(/(\d{4})-?(\d{2})-?(\d{2})(.*)/, '$1-$2-$3$4') || isGpx[1]
                        });
                    }
                });
                gpxs.sort(function (a, b) {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                });
                deferred.resolve(gpxs);
            });
            return deferred.promise;
        }

        return {
            list: list
        };

    });
