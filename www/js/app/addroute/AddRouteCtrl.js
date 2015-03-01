var AddRouteCtrl = function ($scope, $state, $ionicPlatform, AddRouteService) {

    this.getStations = function () {
        AddRouteService.stationsDeferredRequest().$promise.then(function (response) {
            console.log(angular.toJson(response.root.stations));
           $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    }

    this.addRouteToFavorites = function () {
        console.log('about to add routes to favorites');
        var favoriteRoutes =  JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        favoriteRoutes.push({origin: this.origin, destination: this.destination});
        window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
        console.log(JSON.stringify(favoriteRoutes));
    }
}
angular.module('bartionic.addroute').controller('AddRouteCtrl', AddRouteCtrl);
