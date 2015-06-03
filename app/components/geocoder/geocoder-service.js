/*global google: false */

angular.module('logbook')

    .factory('GeocoderService', function ($q) {
        'use strict';

        function reverseGeocode(point) {
            var latlng = new google.maps.LatLng(point.latitude, point.longitude),
                geocoder = new google.maps.Geocoder(),
                deferred = $q.defer();

            function townName(addressComponents) {
                // Heuristics show that this is the best town name
                return addressComponents.length < 6 ? addressComponents[1].long_name : addressComponents[2].long_name;
            }

            geocoder.geocode({latLng: latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    deferred.resolve(townName(results[0].address_components));
                }
            });
            return deferred.promise;
        }

        return {
            reverse: reverseGeocode
        };

    });
