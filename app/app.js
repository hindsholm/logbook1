angular.module('logbook', ['ngRoute', 'googlechart', 'ui.bootstrap', 'uiGmapgoogle-maps'])

    .config(function configGmap(uiGmapGoogleMapApiProvider) {
        'use strict';
        uiGmapGoogleMapApiProvider.configure({
            china: false,
            v: '3.17',
            libraries: '',
            sensor: false
        });
    })

    .config(['$routeProvider', function configRoute($routeProvider) {
        'use strict';
        $routeProvider
            .when('/track/:id?', {
                templateUrl: 'detail.html',
                controller: 'DetailController',
                controllerAs: 'vm',
                resolve: {
                    trackData: function resolveTrackData($route, TrackService) {
                        return $route.current.params.id ? TrackService.loadGpx($route.current.params.id) : null;
                    }
                }
            })
            .otherwise({
                redirectTo: '/track/'
            });
    }]);
