angular.module('bartonic.myrouteschedule', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.myrouteschedule', {
            url: '/myrouteschedule',
            cache: false,
            views: {
                'tab-myroutes': {
                    controller: 'MyRouteScheduleCtrl as myrouteschedule',
                    templateUrl: 'js/app/myrouteschedule/myrouteschedule.html',
                    resolve: {
                        stations: function(StationsLookupService) {
                            return StationsLookupService.stationsDeferredRequest().$promise;
                        }
                    }
                }
            }
        })
    });
