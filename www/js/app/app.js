angular.module('bartionic', ['ionic', 'ngCordova', 'xml', 'timer', 'emguo.poller', 'bartionic.myroutes', 'bartionic.addroute', 'bartionic.quicklookup', 'bartionic.map'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, ENV) {
        $httpProvider.interceptors.push('xmlHttpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

        $urlRouterProvider.otherwise('/tab/myroutes');

    })
    .config(function (pollerConfig) {
        pollerConfig.stopOnStateChange = true; // If you use $stateProvider from ui-router.
        pollerConfig.stopOnRouteChange = true; // If you use $routeProvider from ngRoute.
    })
    .config(function ($stateProvider) {
        $stateProvider.state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "js/app/tabs/tabs.html"
        })
    })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    })
;
