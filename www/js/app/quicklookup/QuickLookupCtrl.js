var QuickLookupCtrl = function ($scope, $log, $interval, StationsLookupService, QuickLookupService) {

    $scope.stations = [];

    StationsLookupService.stationsDeferredRequest().$promise.then(function (response) {
        $scope.stations = response.root.stations.station;
    }), function (err) {
        console.error("Exception occurred in retrieving stations: " + err.message);
    };

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var stations = $scope.stations;
        var origin = this.origin.abbr;
        var destination = this.destination.abbr;
        quickLookUp(stations, origin, destination);
        $interval(function () {
            quickLookUp(stations, origin, destination);
        }, 60000);
    }

    function quickLookUp(stations, origin, destination) {
        QuickLookupService.getEstimatedDeparture(stations, origin, destination).then(function (data) {
            $scope.quickLookups = data;
        }, function (error) {
            $log.error("error in getting estimated departures : " + error);
        });
    }
}
angular.module('bartonic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
