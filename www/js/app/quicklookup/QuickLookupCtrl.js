var QuickLookupCtrl = function ($scope, $filter, $state, $ionicPlatform, QuickLookupService) {

    this.getStations = function () {
        QuickLookupService.stationsDeferredRequest().$promise.then(function (response) {
            console.log(angular.toJson(response.root.stations));
            $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    }

    this.showEstimatedDeparture = function () {
        var destination = this.destination;
        QuickLookupService.departureTimeDeferredRequest(this.origin).$promise.then(function (response) {
            console.log(angular.toJson(response.root.station.etd));
            var estDepartureDetails =  $filter('filter')(response.root.station.etd, { abbreviation: destination });
            console.log(estDepartureDetails[0].estimate[0].minutes);
            $scope.estDeparture = parseInt(estDepartureDetails[0].estimate[0].minutes) * 60;
        }), function (err) {
            console.error("Exception occurred in retrieving estimated departure : " + err.message);
        };
    }
}
angular.module('bartionic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
