var QuickLookupCtrl = function ($scope, $filter, $state, $ionicPlatform, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    this.showEstimatedDeparture = function () {
        $scope.quickLookups = [];
        var stations = $scope.stations;
        var origin = this.origin.abbr;
        var destination = this.destination.abbr;

        ScheduledDepartureDetailsService.scheduledDepartureDetailsDeferredRequest(origin, destination).$promise.then(function (scheduledDepartureDetails) {

            angular.forEach(scheduledDepartureDetails.root.schedule.request.trip, function (trip, key) {
                var quickLookup = {};
                quickLookup.destination = destination;
                quickLookup.hasLink = false;
                quickLookup.hasMoreLinks = false;
                quickLookup.id = key;
                quickLookup.routeFare = trip._fare;
                quickLookup.destTimeMin = trip._destTimeMin;
                if (angular.isArray(trip.leg)) {
                    quickLookup.hasLink = true;
                    quickLookup.trainHeadStation = trip.leg[0]._trainHeadStation;
                    quickLookup.firstStationName = $filter('filter')(stations, {abbr: quickLookup.trainHeadStation}, true)[0].name;
                    quickLookup.connectingStationName = $filter('filter')(stations, {abbr: trip.leg[0]._destination}, true)[0].name;
                    quickLookup.destinationStationName = $filter('filter')(stations, {abbr: trip.leg[1]._trainHeadStation}, true)[0].name;
                    if (trip.leg[2] != null) {
                        quickLookup.hasMoreLinks = true;
                        quickLookup.finalConnectingStationName = $filter('filter')(stations, {abbr: trip.leg[1]._destination}, true)[0].name;
                        quickLookup.finalDestinationStationName = $filter('filter')(stations, {abbr: trip.leg[2]._trainHeadStation}, true)[0].name;
                    }
                } else {
                    quickLookup.trainHeadStation = trip.leg._trainHeadStation;
                    quickLookup.firstStationName = $filter('filter')(stations, {abbr: quickLookup.trainHeadStation}, true)[0].name;
                }

                EstTimeDepartureService.departureTimeDeferredRequest(origin).promise.then(null, null, function (estTimeDeparture) {

                    var estDepartureDetails = angular.isArray(estTimeDeparture.root.station.etd) ? $filter('filter')(estTimeDeparture.root.station.etd, {abbreviation: quickLookup.trainHeadStation}, true) : estTimeDeparture.root.station.etd;
                    if (estDepartureDetails != null) {
                        if (angular.isArray(estDepartureDetails)) {
                            estDepartureDetails = estDepartureDetails[0];
                        }
                        if (angular.isArray(estDepartureDetails.estimate)) {
                            quickLookup.estDeparture = isNaN(estDepartureDetails.estimate[key].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate[key].minutes) * 60;
                        } else {
                            quickLookup.estDeparture = isNaN(estDepartureDetails.estimate.minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate.minutes) * 60;
                        }
                    }
                });

                $scope.quickLookups.push(quickLookup);
            });

        }), function (err) {
            console.log("Exception occurred in getting schedule : " + e);
        }
    }
}
angular.module('bartonic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
