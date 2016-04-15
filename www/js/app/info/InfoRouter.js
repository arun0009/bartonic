angular.module('bartonic.info', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.info', {
            url: '/info',
            views: {
                'tab-info': {
                    controller: 'InfoCtrl as info',
                    templateUrl: 'js/app/info/info.html'
                }
            }
        })
    });
