var AddRouteCtrl = function ($scope, $state, $log, $filter, StationsLookupService) {

    $scope.stations = [];

    StationsLookupService.stationsDeferredRequest().$promise.then(function (response) {
        $scope.stations = response.root.stations.station;
    }), function (err) {
        console.error("Exception occurred in retrieving stations: " + err.message);
    };

    this.addRouteToFavorites = function () {
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        var index = favoriteRoutes.length;

        if (!angular.isUndefined(this.origin) && !angular.isUndefined(this.destination) && this.origin.abbr != this.destination.abbr) {
            if ($filter('filter')(favoriteRoutes, {originAbbr: this.origin.abbr, destinationAbbr: this.destination.abbr}).length != 0) {
                $state.go("tab.myroutes", {}, {reload: false});
                return;
            }
            favoriteRoutes.push({
                index: ++index,
                originAbbr: this.origin.abbr,
                originName: this.origin.name,
                destinationAbbr: this.destination.abbr,
                destinationName: this.destination.name
            });
            if (this.reverseDirection) {
                favoriteRoutes.push({
                    index: ++index,
                    originAbbr: this.destination.abbr,
                    originName: this.destination.name,
                    destinationAbbr: this.origin.abbr,
                    destinationName: this.origin.name
                });
            }
            window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
            $log.debug(JSON.stringify(favoriteRoutes));
            $state.go("tab.myroutes", {}, {reload: true});
        }
    }

    this.cancelAddRoute = function () {
        $state.go("tab.myroutes");
    }
}
angular.module('bartonic.addroute').controller('AddRouteCtrl', AddRouteCtrl);
