angular.module('bartonic', ['ionic', 'ionic-modal-select', 'ngCordova', 'xml', 'timer', 'emguo.poller', 'bartonic.myroutes', 'bartonic.myrouteschedule',
    'bartonic.addroute', 'bartonic.quicklookup', 'bartonic.map'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, ENV) {
        $logProvider.debugEnabled(ENV.DEBUGENABLED);
        $httpProvider.interceptors.push('xmlHttpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
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
    .run(function ($ionicPlatform, $state, $rootScope, StationsLookupService) {
        $ionicPlatform.ready(function () {
            var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
            if (favoriteRoutes.length != 0) {
                $state.go("tab.myroutes");
            } else {
                $state.go('tab.addroute');
            }
            hideSplashScreen();
            
            $ionicPlatform.on('resume', function () {
                $state.go($state.current, {}, {reload: true});
            });

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })

        function hideSplashScreen() {
            if (navigator.splashscreen) {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 100);
            }
        }
    });


