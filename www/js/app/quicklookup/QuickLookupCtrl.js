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
        QuickLookupService.departureTimeDeferredRequest(this.origin).promise.then(null, null, function (response) {
            var estDepartureDetails = $filter('filter')(response.root.station.etd, {abbreviation: destination});
            if(estDepartureDetails != null && estDepartureDetails.length > 0) {
                console.log("estimated minutes for departure: " + estDepartureDetails[0].estimate[0].minutes);
                $scope.estDeparture = isNaN(estDepartureDetails[0].estimate[0].minutes) ? 'LEAVING NOW' : parseInt(estDepartureDetails[0].estimate[0].minutes) * 60;
                console.log("scope set to " + $scope.estDeparture);
            }
            $scope.$broadcast('timer-set-countdown', $scope.estDeparture);
        });
    }
}
angular.module('bartionic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
