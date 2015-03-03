var QuickLookupCtrl = function ($scope, $filter, $state, $ionicPlatform, StationsLookupService, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    this.getStations = function () {
        StationsLookupService.stationsDeferredRequest().$promise.then(function (response) {
            $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    };


    this.showEstimatedDeparture = function () {
        var origin = this.origin;
        var destination = this.destination;
        ScheduledDepartureDetailsService.scheduledDepartureDetailsDeferredRequest(origin, destination).$promise.then(function (scheduledDepartureDetails) {
            var trainHeadStation;
            if (angular.isArray(scheduledDepartureDetails.root.schedule.request.trip[0].leg)) {
                trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
            } else {
                trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
            }
            console.log(trainHeadStation);
            EstTimeDepartureService.departureTimeDeferredRequest(origin).promise.then(null, null, function (response) {
                var estDepartureDetails = $filter('filter')(response.root.station.etd, {abbreviation: trainHeadStation});
                if (estDepartureDetails != null && estDepartureDetails.length > 0) {
                    console.log("estimated minutes for departure: " + estDepartureDetails[0].estimate[0].minutes);
                    $scope.estDeparture = isNaN(estDepartureDetails[0].estimate[0].minutes) ? 'LEAVING NOW' : parseInt(estDepartureDetails[0].estimate[0].minutes) * 60;
                    console.log("scope set to " + $scope.estDeparture);
                }
                $scope.$broadcast('timer-set-countdown', $scope.estDeparture);
            });
        }), function (err) {
            console.log("Exception occurred in getting schedule : " + e);
        }
    };
}
angular.module('bartionic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
