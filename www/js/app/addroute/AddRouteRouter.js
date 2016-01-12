angular.module('bartonic.addroute', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.addroute', {
            url: '/addroute',
            cache: false,
            views: {
                'tab-addroute': {
                    controller: 'AddRouteCtrl as addroute',
                    templateUrl: 'js/app/addroute/addroute.html'
                }
            }
        })
    });
