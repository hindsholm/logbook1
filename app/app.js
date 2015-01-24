angular.module('logbook', ['ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps'])

    .config(function(uiGmapGoogleMapApiProvider) {
        'use strict';
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            china: false,
            v: '3.17',
            libraries: '',
            sensor: false
        });
    })

    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider
            .when('/list', {
                templateUrl: 'list.html',
                controller: 'ListController',
                controllerAs: 'vm'
            })
            .when('/track/:id', {
                templateUrl: 'detail.html',
                controller: 'DetailController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/list'
            });
    }]);
