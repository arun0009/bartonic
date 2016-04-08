var MyRouteScheduleCtrl = function ($scope, $filter, $log, $interval, MyRoutesService, QuickLookupService) {

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        var route = $filter('filter')(favoriteRoutes, {index: MyRoutesService.getMyRoute().index})[0];
        var origin = route.originAbbr;
        var destination = route.destinationAbbr;
        quickLookUp(origin, destination);
        $interval(function () {
            quickLookUp(origin, destination);
        }, 60000);
    }

    function quickLookUp(origin, destination) {
        var quickLookups = [];
        QuickLookupService.getEstimatedDeparture(origin, destination).subscribe(function (quickLookup) {
            $log.debug("quickLookup is ::", angular.toJson(quickLookup));
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

angular.module('bartonic.myrouteschedule').controller('MyRouteScheduleCtrl', MyRouteScheduleCtrl);
