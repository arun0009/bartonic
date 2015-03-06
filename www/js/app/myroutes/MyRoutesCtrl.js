var MyRoutesCtrl = function ($scope, $state, $filter, $ionicPlatform, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    this.loadFavoriteRouteSchedule = function () {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        console.log('fav routes : ' + angular.toJson(favoriteRoutes));
        for (var i = 0; i < favoriteRoutes.length; i++) {
            var originAbbr = favoriteRoutes[i].originAbbr;
            var destinationAbbr = favoriteRoutes[i].destinationAbbr;
            $scope.originName = favoriteRoutes[i].originName;
            $scope.destinationName = favoriteRoutes[i].destinationName;
            ScheduledDepartureDetailsService.scheduledDepartureDetailsDeferredRequest(originAbbr, destinationAbbr).$promise.then(function (scheduledDepartureDetails) {
                $scope.routeFare = scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
                if (angular.isArray(scheduledDepartureDetails.root.schedule.request.trip[0].leg)) {
                    trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                } else {
                    trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                }
                console.log(trainHeadStation);
                EstTimeDepartureService.departureTimeDeferredRequest(originAbbr).promise.then(null, null, function (response) {
                    var estDepartureDetails = $filter('filter')(response.root.station.etd, {abbreviation: trainHeadStation});
                    if (estDepartureDetails != null && estDepartureDetails.length > 0) {
                        console.log("estimated minutes for departure: " + estDepartureDetails[0].estimate[0].minutes);
                        $scope.estDeparture = isNaN(estDepartureDetails[0].estimate[0].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails[0].estimate[0].minutes) * 60;
                        console.log("scope set to " + $scope.estDeparture);
                    }
                    $scope.$broadcast('timer-set-countdown', $scope.estDeparture);
                });
            }), function (err) {
                console.log("Exception occurred in getting schedule : " + e);
            }
        }
    };
}

angular.module('bartionic.myroutes').controller('MyRoutesCtrl', MyRoutesCtrl);
