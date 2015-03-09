var MyRoutesCtrl = function ($scope, $state, $filter, $ionicPlatform, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    $scope.myRoutes = [];
    var scheduleDepartureDetailsPromise = [];
    var estTimeDeparturePoller = [];
    //window.localStorage.clear();
    this.loadFavoriteRouteSchedule = function () {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        console.log('fav routes : ' + angular.toJson(favoriteRoutes));
        for (var i = 0; i < favoriteRoutes.length; i++) {
            var originAbbr = favoriteRoutes[i].originAbbr;
            var destinationAbbr = favoriteRoutes[i].destinationAbbr;
            scheduleDepartureDetailsPromise.push(ScheduledDepartureDetailsService.scheduledDepartureDetailsDeferredRequest(originAbbr, destinationAbbr));
            estTimeDeparturePoller.push(EstTimeDepartureService.departureTimeDeferredRequest(originAbbr));
        }

        for (var j = 0; j < favoriteRoutes.length; j++) {
            var myRouteInfo = {};
            myRouteInfo.id = j;
            myRouteInfo.originName = favoriteRoutes[j].originName;
            myRouteInfo.destinationName = favoriteRoutes[j].destinationName;
            var trainHeadStation = "";
            scheduleDepartureDetailsPromise[j].$promise.then(function (scheduledDepartureDetails) {
                myRouteInfo.routeFare = scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
                if (angular.isArray(scheduledDepartureDetails.root.schedule.request.trip[0].leg)) {
                    trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                } else {
                    trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                }

            }).then(estTimeDeparturePoller[j].promise.then(null, null, function (estTimeDeparture) {
                var estDepartureDetails = $filter('filter')(estTimeDeparture.root.station.etd, {abbreviation: trainHeadStation});
                if (estDepartureDetails != null && estDepartureDetails.length > 0) {
                    myRouteInfo.estDeparture = isNaN(estDepartureDetails[0].estimate[0].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails[0].estimate[0].minutes) * 60;
                }
                $scope.$broadcast('timer-set-countdown', myRouteInfo.estDeparture);
               console.log("myRouteInfo is : " + angular.toJson(myRouteInfo));
                var myRouteInfoInScope = $filter('filter')($scope.myRoutes, {id: myRouteInfo.id}, true);
                if (!myRouteInfoInScope.length) {
                    $scope.myRoutes.push(myRouteInfo);
                }
                console.log("myRoutes in scope : " + angular.toJson($scope.myRoutes));
            }), function (err) {
                console.log("Exception occurred in getting schedule : " + e);
            });


        }
    }
}

angular.module('bartionic.myroutes').controller('MyRoutesCtrl', MyRoutesCtrl);
