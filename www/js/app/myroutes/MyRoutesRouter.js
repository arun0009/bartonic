angular.module('bartionic.myroutes', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.myroutes', {
            url: '/myroutes',
            cache: false,
            views: {
                'tab-myroutes': {
                    controller: 'MyRoutesCtrl as myroutes',
                    templateUrl: 'js/app/myroutes/myroutes.html'
                }
            }
        })
    });
