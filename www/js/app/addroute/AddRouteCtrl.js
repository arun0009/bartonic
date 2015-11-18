var AddRouteCtrl = function ($scope, $state, $ionicPlatform, StationsLookupService) {


    this.getStations = function () {
        StationsLookupService.stationsDeferredRequest().$promise.then(function (response) {
           $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    }

    this.addRouteToFavorites = function () {
        var favoriteRoutes =  JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        var index = favoriteRoutes.length;
        favoriteRoutes.push({index: ++index, originAbbr: this.origin.abbr, originName: this.origin.name, destinationAbbr: this.destination.abbr, destinationName: this.destination.name});
        if(this.reverseDirection){
            favoriteRoutes.push({index: ++index, originAbbr: this.destination.abbr, originName: this.destination.name, destinationAbbr: this.origin.abbr, destinationName: this.origin.name});
        }
        window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
        console.log(JSON.stringify(favoriteRoutes));
        $state.go("tab.myroutes", {}, {reload: true});
    }

    this.cancelAddRoute = function () {
        $scope.go("tab.myroutes");
    }
}
angular.module('bartionic.addroute').controller('AddRouteCtrl', AddRouteCtrl);
