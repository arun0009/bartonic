var MyRoutesCtrl = function ($scope, $state, $filter, $ionicPlatform, MyRoutesService) {

    this.loadFavoriteRouteSchedule = function () {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        console.log('fav routes : ' + angular.toJson(favoriteRoutes));
        for (var i = 0; i < favoriteRoutes.length; i++) {
            var destination =  favoriteRoutes[i].destination;
            MyRoutesService.departureTimeDeferredRequest(favoriteRoutes[i].origin).promise.then(null, null, function (response) {
                var estDepartureDetails = $filter('filter')(response.root.station.etd, {abbreviation: destination});
                if (estDepartureDetails != null && estDepartureDetails.length > 0) {
                    console.log("estimated minutes for departure: " + estDepartureDetails[0].estimate[0].minutes);
                    $scope.estDeparture = isNaN(estDepartureDetails[0].estimate[0].minutes) ? 'LEAVING NOW' : parseInt(estDepartureDetails[0].estimate[0].minutes) * 60;
                    console.log("scope set to " + $scope.estDeparture);
                }
                $scope.$broadcast('timer-set-countdown', $scope.estDeparture);
            });
        }
    }
}

angular.module('bartionic.myroutes').controller('MyRoutesCtrl', MyRoutesCtrl);
