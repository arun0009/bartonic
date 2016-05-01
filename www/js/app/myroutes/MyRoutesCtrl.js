var MyRoutesCtrl = function ($rootScope, $scope, $state, $filter, $ionicPlatform, $q, $interval, $log, MyRoutesService, ScheduledDepartureDetailsService,
                             EstTimeDepartureService) {

    $scope.myRoutes = [];
    $scope.data = {
        showDelete: false,
        showReorder: false
    };

    var originNames = [];
    var destinationNames = [];
    //window.localStorage.clear();

    function getScheduleDepuartureDetailsSource(favoriteRoutes) {
        var scheduleDepartureDetailsObservables = [];
        for (var i = 0; i < favoriteRoutes.length; i++) {
            var originAbbr = favoriteRoutes[i].originAbbr;
            var destinationAbbr = favoriteRoutes[i].destinationAbbr;
            originNames.push(favoriteRoutes[i].originName);
            destinationNames.push(favoriteRoutes[i].destinationName);
            //$log.debug("pushing in " + originAbbr + " destination is : " + destinationAbbr);
            scheduleDepartureDetailsObservables.push(ScheduledDepartureDetailsService.getScheduledDepartureDetailsObservable(originAbbr, destinationAbbr, 'depart', 'now', 'now'));
        }
        return Rx.Observable.just(scheduleDepartureDetailsObservables);
    }

    function setEstimatedDepartureDetails(myRouteInfo, originAbbr, trainHeadStations) {
        return EstTimeDepartureService.getEstTimeDepartureObservable(originAbbr).map(function (response) {
            var estTimeDeparture = response.data;
            myRouteInfo.originName = originNames[myRouteInfo.id];
            myRouteInfo.destinationName = destinationNames[myRouteInfo.id];
            var estDepartureDetails = EstTimeDepartureService.getEstimatedDeparturesForHeadStations(estTimeDeparture, trainHeadStations);

            //$log.debug("before sort --> " + angular.toJson(estDepartureDetails));
            estDepartureDetails = estDepartureDetails.sort(EstTimeDepartureService.compareDepartureTimes);
            //$log.debug("after sort --> " + angular.toJson(estDepartureDetails));

            if (estDepartureDetails != null) {
                //should be a way to filter and return first object?
                if (angular.isArray(estDepartureDetails)) {
                    estDepartureDetails = estDepartureDetails[0];
                }
                if (angular.isDefined(estDepartureDetails)) {
                    if (angular.isArray(estDepartureDetails.estimate)) {
                        myRouteInfo.estDeparture = isNaN(estDepartureDetails.estimate[0].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate[0].minutes) * 60;
                        myRouteInfo.carLength = estDepartureDetails.estimate[0].length;
                    } else {
                        myRouteInfo.estDeparture = isNaN(estDepartureDetails.estimate.minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate.minutes) * 60;
                        myRouteInfo.carLength = estDepartureDetails.estimate.length;
                    }
                } else {
                    myRouteInfo.estDeparture = 'No Service';
                }
            }
            return myRouteInfo;
        });
    }

    this.loadFavoriteRouteSchedule = function () {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        getMyFavoriteRoutes(favoriteRoutes);
        $interval(function () {
            getMyFavoriteRoutes(favoriteRoutes);
        }, 15000);
    }

    function getMyFavoriteRoutes(favouriteRoutes) {
        var myFavRoutes = [];
        getFavoriteRouteSchedule(favouriteRoutes).subscribe(function (favRoute) {
            myFavRoutes.push(favRoute);
        }, function (err) {
            $log.error("error occurred calling favorite routes ", err);
        }, function () {
            $log.debug("completed getMyFavoriteRoutes call");
            myFavRoutes = $filter('orderBy')(myFavRoutes, "index");
            $scope.myRoutes = myFavRoutes;
            $scope.$apply();
        });
    }

    function getFavoriteRouteSchedule(favoriteRoutes) {
        var trainHeadStations = {};
        return getScheduleDepuartureDetailsSource(favoriteRoutes).flatMap(function (scheduleDepartureDetailsSource) {
            return Rx.Observable.range(0, scheduleDepartureDetailsSource.length).flatMap(function (key) {
                return scheduleDepartureDetailsSource[key].map(function (response) {
                    var scheduledDepartureDetails = response.data;
                    trainHeadStations = ScheduledDepartureDetailsService.getTrainHeadStations(scheduledDepartureDetails);
                    //$log.debug("train head stations are : " + angular.toJson(trainHeadStations));
                    var myRouteInfo = {};
                    myRouteInfo.index = favoriteRoutes[key].index;
                    myRouteInfo.id = key;
                    myRouteInfo.routeFare = scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
                    myRouteInfo.destTimeMin = scheduledDepartureDetails.root.schedule.request.trip[0]._destTimeMin;

                    myRouteInfo.hasLink = false;
                    if (angular.isArray(scheduledDepartureDetails.root.schedule.request.trip[0].leg)) {
                        myRouteInfo.hasLink = true;
                        myRouteInfo.trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                    } else {
                        myRouteInfo.trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                    }
                    return myRouteInfo;
                }).flatMap(function (myRouteInfo) {
                    return setEstimatedDepartureDetails(myRouteInfo, favoriteRoutes[myRouteInfo.id].originAbbr, trainHeadStations);
                });
            });
        });
    }

    this.getRouteSchedules = function (route) {
        MyRoutesService.setMyRoute(route);
        $state.go('tab.myrouteschedule');
    }

    this.deleteRoute = function (route) {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        for (var i = 0; i < favoriteRoutes.length; i++) {
            $log.debug(favoriteRoutes[i]);
            if (favoriteRoutes[i].originName === route.originName && favoriteRoutes[i].destinationName === route.destinationName) {
                favoriteRoutes.splice(i, 1);
                for (var i = route.index; i < route.length; i++) {
                    var favoriteRoute = favoriteRoutes[i];
                    favoriteRoute.index = parseInt(favoriteRoute.index) - 1;
                    favoriteRoutes.splice(i, 1);
                    favoriteRoutes.splice(i, 0, favoriteRoute);
                }
            }
        }
        window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
        window.location.reload();
    }

    this.reorderRoutes = function (route, fromIndex, toIndex) {
        if (fromIndex != toIndex) {
            var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes'));
            $log.debug(angular.toJson(favoriteRoutes));
            var routeReordered = favoriteRoutes[fromIndex];
            routeReordered.index = favoriteRoutes[toIndex].index;
            favoriteRoutes.splice(fromIndex, 1);
            favoriteRoutes.splice(toIndex, 0, routeReordered);
            if (toIndex < fromIndex) {
                for (var i = toIndex + 1; i <= fromIndex; i++) {
                    var favoriteRoute = favoriteRoutes[i];
                    favoriteRoute.index = parseInt(favoriteRoute.index) + 1;
                    favoriteRoutes.splice(i, 1);
                    favoriteRoutes.splice(i, 0, favoriteRoute);
                }
            } else {
                for (var i = fromIndex; i < toIndex; i++) {
                    var favoriteRoute = favoriteRoutes[i];
                    favoriteRoute.index = parseInt(favoriteRoute.index) - 1;
                    favoriteRoutes.splice(i, 1);
                    favoriteRoutes.splice(i, 0, favoriteRoute);
                }
            }
            window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
            window.location.reload();
        }
    }
}


angular.module('bartonic.myroutes').controller('MyRoutesCtrl', MyRoutesCtrl);
