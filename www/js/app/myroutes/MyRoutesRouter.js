angular.module('bartionic.myroutes', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.myroutes', {
            url: '/myroutes',
            views: {
                'tab-myroutes': {
                    controller: 'MyRoutesCtrl as myroutes',
                    templateUrl: 'js/app/myroutes/myroutes.html'
                }
            }
        })
    });
