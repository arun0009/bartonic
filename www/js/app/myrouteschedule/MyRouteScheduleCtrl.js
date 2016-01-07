var MyRouteScheduleCtrl = function ($scope, $filter, $log, $interval, stations, MyRoutesService, QuickLookupService) {

    $scope.stations = stations.root.stations.station;

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        var route = $filter('filter')(favoriteRoutes, {index: MyRoutesService.getMyRoute().index})[0];
        var origin = route.originAbbr;
        var destination = route.destinationAbbr;
        quickLookUp($scope.stations, origin, destination);
        $interval(function () {
            quickLookUp($scope.stations, origin, destination);
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

angular.module('bartonic.myrouteschedule').controller('MyRouteScheduleCtrl', MyRouteScheduleCtrl);
