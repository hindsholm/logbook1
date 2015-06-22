/*global DOMParser: false; */

angular.module('logbook')

    .factory('GpxService', function ($http, $q) {
        'use strict';

        function list() {
            var deferred = $q.defer();
            // TODO: create '/tracks' constant
            $http.get('/tracks').success(function (data) {
                var dom = new DOMParser().parseFromString(data, 'text/html'),
                    gpxs = [],
                    href;
                angular.forEach(dom.links, function (link) {
                    href = link.getAttribute('href');
                    if (href.indexOf('.gpx', href.length - 4) !== -1) { // endsWith
                        gpxs.push({
                            file: href,
                            name: href.replace(/(.*\/)?(\d{4})(\d{2})(\d{2})(\w?)\.gpx/, '$2-$3-$4 $5')
                        });
                    }
                });
                deferred.resolve(gpxs);
            });
            return deferred.promise;
        }

        return {
            list: list
        };

    });
