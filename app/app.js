angular.module('logbook', ['ngMaterial', 'googlechart', 'uiGmapgoogle-maps'])

    .config(function ($mdThemingProvider, $mdIconProvider) {
        'use strict';
        $mdIconProvider.icon('menu', './assets/svg/menu.svg');
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('red');
    })

    .config(function configGmap(uiGmapGoogleMapApiProvider) {
        'use strict';
        uiGmapGoogleMapApiProvider.configure({
            china: false,
            v: '3.17',
            libraries: '',
            sensor: false
        });
    });
