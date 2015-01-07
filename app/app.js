angular.module('logbook', ['ngRoute', 'ui.bootstrap', 'google-maps'])

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
