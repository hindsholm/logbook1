angular.module('logbook', ['ngRoute', 'googlechart', 'ui.bootstrap', 'uiGmapgoogle-maps'])

    .config(function configGmap(uiGmapGoogleMapApiProvider) {
        'use strict';
        uiGmapGoogleMapApiProvider.configure({
            china: false,
            v: '3.17',
            libraries: '',
            sensor: false
        });
    });
