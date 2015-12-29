var QuickLookupCtrl = function ($scope, $log, $interval, stations, QuickLookupService) {

    $scope.stations = stations.root.stations.station;

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var stations = $scope.stations;
        var origin = this.origin.abbr;
        var destination = this.destination.abbr;
        quickLookUp(stations, origin, destination);
        $interval(function () {
            quickLookUp(stations, origin, destination)
        }, 60000);
    }

    function quickLookUp(stations, origin, destination){
        QuickLookupService.getEstimatedDeparture(stations, origin, destination).then(function (data) {
            $scope.quickLookups = data;
        }, function (error) {
            $log.error("error in getting estimated departures : " + error);
        });
    }
}
angular.module('bartonic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
