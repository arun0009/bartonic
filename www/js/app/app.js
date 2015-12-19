angular.module('bartionic', ['ionic', 'ionic-modal-select', 'ngCordova', 'xml', 'timer', 'emguo.poller', 'bartionic.myroutes', 'bartionic.myrouteschedule',
    'bartionic.addroute', 'bartionic.quicklookup', 'bartionic.map'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, ENV) {
        $logProvider.debugEnabled(ENV.DEBUGENABLED);
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
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('center');
    })
    .run(function ($ionicPlatform, $state) {
        $ionicPlatform.ready(function () {

            //hide splash screen
            if(navigator.splashscreen){
                navigator.splashscreen.hide();
            }

            $ionicPlatform.on('resume', function () {
                $state.go($state.current, {}, {reload: true});
            });

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    })
;
