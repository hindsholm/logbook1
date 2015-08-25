angular.module('logbook', ['ngMaterial', 'googlechart', 'uiGmapgoogle-maps'])

    .config(function ($mdThemingProvider, $mdIconProvider) {
        'use strict';
        $mdIconProvider.icon('menu', './assets/svg/menu.svg');
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('red');
    })

    .config(function configGmap(uiGmapGoogleMapApiProvider) {
        'use strict';
        uiGmapGoogleMapApiProvider.configure({
            china: false,
            v: '3',
            libraries: '',
            sensor: false
        });
    });
