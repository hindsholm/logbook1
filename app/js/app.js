
angular.module('logbook', ['ngRoute', 'logbook.controllers', 'ui.bootstrap', 'AngularGM'])

    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
        $routeProvider.when('/detail', {templateUrl: 'partials/detail.html', controller: 'DetailCtrl'});
        $routeProvider.otherwise({redirectTo: '/detail'});
    }])

    .run(function ($rootScope) {
        'use strict';
        $rootScope.$on('$routeChangeSuccess', function (e, current) {
            if (current.$$route) {
                $rootScope.route = current.$$route.originalPath;
            }
        });
    });

