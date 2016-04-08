angular.module('bartonic', ['ionic', 'ionic-modal-select', 'ngCordova', 'xml', 'timer', 'bartonic.myroutes', 'bartonic.myrouteschedule',
    'bartonic.addroute', 'bartonic.quicklookup', 'bartonic.map'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, ENV) {
        $logProvider.debugEnabled(ENV.DEBUGENABLED);
        $httpProvider.interceptors.push('xmlHttpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
    })
    .config(function ($stateProvider) {
        $stateProvider.state('tab', {
            url: "/tab",
            templateUrl: "js/app/tabs/tabs.html"
        })
    })
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.navBar.alignTitle('center');
    })
    .run(function ($ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
            if (favoriteRoutes.length != 0) {
                $state.go("tab.myroutes");
                hideSplashScreen(100);
            } else {
                $state.go('tab.addroute');
                hideSplashScreen(1000);
            }

            $ionicPlatform.on('resume', function () {
                $state.go($state.current, {}, {reload: true});
            });

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })

        function hideSplashScreen(milliseconds) {
            if (navigator.splashscreen) {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, milliseconds);
            }
        }
    });


