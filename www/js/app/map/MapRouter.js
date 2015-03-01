angular.module('bartionic.map', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.map', {
            url: '/map',
            views: {
                'tab-map': {
                    templateUrl: 'js/app/map/map.html'
                }
            }
        })
    });
