var QuickLookupCtrl = function ($scope, $filter, $log, $interval, StationsLookupService, QuickLookupService) {

    $scope.stations = [];

    StationsLookupService.stationsLookupObservable().subscribe(function (response) {
        $scope.stations = response.data.root.stations.station;
    });

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var origin = this.origin.abbr;
        var destination = this.destination.abbr;
        quickLookUp(origin, destination);
        $interval(function () {
            quickLookUp(origin, destination);
        }, 60000);
    }

    function quickLookUp(origin, destination) {
        var quickLookups = [];
        QuickLookupService.getEstimatedDeparture(origin, destination).subscribe(function (quickLookup) {
            quickLookups.push(quickLookup);
        }, function (err) {
            $log.error("error occurred calling estimate departure ", err);
        }, function () {
            $log.debug("completed quickLookUp call");
            quickLookups = $filter('orderBy')(quickLookups, "estDepartureFlag");
            $scope.quickLookups = quickLookups;
            $scope.$apply();
        });
    }
}
angular.module('bartonic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
