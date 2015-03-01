angular.module('bartionic.addroute', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.addroute', {
            url: '/addroute',
            views: {
                'tab-addroute': {
                    controller: 'AddRouteCtrl as addroute',
                    templateUrl: 'js/app/addroute/addroute.html'
                }
            }
        })
    });
