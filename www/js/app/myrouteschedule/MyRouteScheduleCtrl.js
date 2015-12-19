var MyRouteScheduleCtrl = function ($scope, $filter, $log, MyRoutesService, QuickLookupService) {

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var favoriteRoutes = JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        var route = $filter('filter')(favoriteRoutes, {index : MyRoutesService.getMyRoute().index})[0];
        var origin = route.originAbbr;
        var destination = route.destinationAbbr;
        QuickLookupService.getEstimatedDeparture($scope.stations, origin, destination).then(function (data) {
            $scope.quickLookups = data;
        }, function (error) {
            $log.error("error in getting estimated departures : " + error);
        });
    }
}

angular.module('bartionic.myrouteschedule').controller('MyRouteScheduleCtrl', MyRouteScheduleCtrl);
