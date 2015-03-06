var AddRouteCtrl = function ($scope, $state, $ionicPlatform, StationsLookupService) {

    this.getStations = function () {
        StationsLookupService.stationsDeferredRequest().$promise.then(function (response) {
            console.log(angular.toJson(response.root.stations));
           $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    }

    this.addRouteToFavorites = function () {
        var favoriteRoutes =  JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        favoriteRoutes.push({originAbbr: this.origin.abbr, originName: this.origin.name, destinationAbbr: this.destination.abbr, destinationName: this.destination.name});
        window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
        console.log(JSON.stringify(favoriteRoutes));
        $state.go("tab.myroutes", {}, {reload: true});
    }

    this.cancelAddRoute = function () {
        $scope.go("tab.myroutes");
    }
}
angular.module('bartionic.addroute').controller('AddRouteCtrl', AddRouteCtrl);
