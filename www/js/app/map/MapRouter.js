angular.module('bartionic.map', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.map', {
            url: '/map',
            views: {
                'tab-map': {
                    controller: 'MapCtrl as map',
                    templateUrl: 'js/app/map/map.html'
                }
            }
        })
    });
