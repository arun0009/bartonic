angular.module('bartonic', ['ionic', 'ionic-modal-select', 'ngCordova', 'xml', 'timer', 'bartonic.myroutes', 'bartonic.addroute', 'bartonic.quicklookup',
    'bartonic.map'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('xmlHttpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

        $urlRouterProvider.otherwise('/tab/myroutes');

    })
    .config(function ($stateProvider) {
        $stateProvider.state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "js/app/tabs/tabs.html"
        })
    })
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('center');
    })
    .run(function ($ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            $ionicPlatform.on('resume', function () {
                $state.go($state.current, {}, {reload: true});
            });

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    })
;
