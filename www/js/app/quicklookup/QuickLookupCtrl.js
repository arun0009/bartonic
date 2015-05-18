var QuickLookupCtrl = function ($scope, $filter, $state, $ionicPlatform, StationsLookupService, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    this.getStations = function () {
        StationsLookupService.stationsDeferredRequest().$promise.then(function (response) {
            $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    };


    this.showEstimatedDeparture = function () {
        var stations = $scope.stations;
        var origin = this.origin;
        var destination = this.destination;
        var quickLookup = {};
        ScheduledDepartureDetailsService.scheduledDepartureDetailsDeferredRequest(origin, destination).$promise.then(function (scheduledDepartureDetails) {
            quickLookup.destination = destination;
            quickLookup.hasLink = false;
            quickLookup.routeFare = scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
            if (angular.isArray(scheduledDepartureDetails.root.schedule.request.trip[0].leg)) {
                quickLookup.hasLink = true;
                quickLookup.trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                quickLookup.firstStationName = $filter('filter')(stations.station, {abbr: quickLookup.trainHeadStation}, true)[0].name;
                quickLookup.connectingStationName = $filter('filter')(stations.station,
                    {abbr: scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._destination}, true)[0].name;
            } else {
                quickLookup.trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                quickLookup.firstStationName = $filter('filter')(stations.station, {abbr: origin}, true)[0].name;
            }

            quickLookup.destinationStationName = $filter('filter')(stations.station, {abbr: destination}, true)[0].name;

            EstTimeDepartureService.departureTimeDeferredRequest(origin).promise.then(null, null, function (response) {
                var estDepartureDetails = $filter('filter')(response.root.station.etd, {abbreviation: quickLookup.trainHeadStation}, true);
                if (estDepartureDetails != null) {
                    if (angular.isArray(estDepartureDetails)) {
                        estDepartureDetails = estDepartureDetails[0];
                    }
                    if (angular.isArray(estDepartureDetails.estimate)) {
                        quickLookup.estDeparture = isNaN(estDepartureDetails.estimate[0].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate[0].minutes) * 60;
                    } else {
                        quickLookup.estDeparture = isNaN(estDepartureDetails.estimate.minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate.minutes) * 60;
                    }
                }
                $scope.quickLookup = quickLookup;
            });
        }), function (err) {
            console.log("Exception occurred in getting schedule : " + e);
        }
    };
}
angular.module('bartionic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
