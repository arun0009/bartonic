var MyRoutesCtrl = function ($scope, $state, $filter, $ionicPlatform, $q, $timeout, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    $scope.myRoutes = [];
    var scheduleDepartureDetailsPromises = [];
    var originNames = [];
    var destinationNames = [];
    //window.localStorage.clear();
    this.loadFavoriteRouteSchedule = function () {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        console.log('fav routes : ' + angular.toJson(favoriteRoutes));
        for (var i = 0; i < favoriteRoutes.length; i++) {
            var originAbbr = favoriteRoutes[i].originAbbr;
            var destinationAbbr = favoriteRoutes[i].destinationAbbr;
            originNames.push(favoriteRoutes[i].originName);
            destinationNames.push(favoriteRoutes[i].destinationName);
            scheduleDepartureDetailsPromises.push(ScheduledDepartureDetailsService.scheduledDepartureDetailsDeferredRequest(originAbbr, destinationAbbr).$promise);
        }

        $q.all(scheduleDepartureDetailsPromises).then(function (data) {
            angular.forEach(data, function (scheduledDepartureDetails, key) {
                var trainHeadStation = "";
                var myRouteInfo = {};
                var routeFare = scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
                var destTimeMin = scheduledDepartureDetails.root.schedule.request.trip[0]._destTimeMin;
                var hasLink = false;
                if (angular.isArray(scheduledDepartureDetails.root.schedule.request.trip[0].leg)) {
                    hasLink = true;
                    trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                } else {
                    trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                }

                var originAbbr = favoriteRoutes[key].originAbbr;
                EstTimeDepartureService.departureTimeDeferredRequest(originAbbr).promise.then(null, null, function (estTimeDeparture) {
                    //console.log("estTimeDeparture is : " + angular.toJson(estTimeDeparture));
                    myRouteInfo.id = key;
                    myRouteInfo.routeFare = routeFare;
                    myRouteInfo.destTimeMin = destTimeMin;
                    myRouteInfo.originName = originNames[key];
                    myRouteInfo.destinationName = destinationNames[key];
                    myRouteInfo.hasLink = hasLink;
                    var estDepartureDetails = $filter('filter')(estTimeDeparture.root.station.etd, {abbreviation: trainHeadStation}, true);
                    if (estDepartureDetails != null) {
                        //should be a way to filter and return first object?
                        if (angular.isArray(estDepartureDetails)) {
                            estDepartureDetails = estDepartureDetails[0];
                        }
                        if (angular.isArray(estDepartureDetails.estimate)) {
                            myRouteInfo.estDeparture = isNaN(estDepartureDetails.estimate[0].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate[0].minutes) * 60;
                        } else {
                            myRouteInfo.estDeparture = isNaN(estDepartureDetails.estimate.minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate.minutes) * 60;
                        }
                    }
                    //$scope.$broadcast('timer-set-countdown', myRouteInfo.estDeparture);
                    var myRouteInfoInScope = $filter('filter')($scope.myRoutes, {id: myRouteInfo.id}, true);
                    if (!myRouteInfoInScope.length) {
                        $scope.myRoutes.push(myRouteInfo);
                    }
                });
            });
        });
    }
}

angular.module('bartionic.myroutes').controller('MyRoutesCtrl', MyRoutesCtrl);
