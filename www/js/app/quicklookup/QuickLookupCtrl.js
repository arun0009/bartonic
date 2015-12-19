var QuickLookupCtrl = function ($scope, $log, QuickLookupService) {

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var stations = $scope.stations;
        var origin = this.origin.abbr;
        var destination = this.destination.abbr;

        QuickLookupService.getEstimatedDeparture(stations, origin, destination).then(function (data) {
            $scope.quickLookups = data;
        }, function (error) {
            $log.error("error in getting estimated departures : " + error);
        });
    }
}
angular.module('bartionic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
