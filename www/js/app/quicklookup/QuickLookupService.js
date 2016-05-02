angular.module('bartonic.quicklookup').factory('QuickLookupService', function ($filter, $log, StationsLookupService, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    return {
        getEstimatedDeparture: function (origin, destination, cmd, date, time) {
            var estTimeDeparture = {};
            var stations = {};
            var headStations = [];
            return StationsLookupService.stationsLookupObservable().map(function (response) {
                stations = response.data.root.stations.station;
                return stations;
            }).flatMap(function (stations) {
                return EstTimeDepartureService.getEstTimeDepartureObservable(origin).map(function (response) {
                    $log.debug('inside first observable...');
                    estTimeDeparture = response.data;
                    return estTimeDeparture;
                })
            }).flatMap(function (estTimeDeparture) {
                return ScheduledDepartureDetailsService.getScheduledDepartureDetailsObservable(origin, destination, cmd, date, time).flatMap(function (response) {
                    var scheduledDepartureDetails = response.data;
                    return Rx.Observable.just(scheduledDepartureDetails.root.schedule.request.trip);
                })
            }).flatMap(function (trips) {
                return Rx.Observable.range(0, trips.length).map(function (indx) {
                    var trip = trips[indx];
                    var quickLookup = quickLookupFunction(indx, destination, trip, stations);
                    $log.debug("quickLookup.trainHeadStation is : ", quickLookup.trainHeadStation);
                    headStations.push(quickLookup.trainHeadStation);
                    var headStationCounter = $filter('filter')(headStations, quickLookup.trainHeadStation, true).length;
                    var estDepartureDetails = angular.isArray(estTimeDeparture.root.station.etd) ? $filter('filter')(estTimeDeparture.root.station.etd, {abbreviation: quickLookup.trainHeadStation}, true) : estTimeDeparture.root.station.etd;
                    $log.debug("estDepartureDetails is : ", angular.toJson(estDepartureDetails));
                    if (estDepartureDetails != null) {
                        if (angular.isArray(estDepartureDetails)) {
                            estDepartureDetails = estDepartureDetails[0];
                        }
                        if (angular.isArray(estDepartureDetails.estimate) && angular.isDefined(estDepartureDetails.estimate[quickLookup.id])) {
                            //$log.debug(angular.toJson(quickLookup) +  ":::::: " + angular.toJson(estDepartureDetails));
                            quickLookup.carLength = estDepartureDetails.estimate[headStationCounter - 1].length;
                            quickLookup.estDepartureFlag = isNaN(estDepartureDetails.estimate[headStationCounter - 1].minutes) ? 0 : parseInt(estDepartureDetails.estimate[headStationCounter - 1].minutes) * 60;
                            quickLookup.estDeparture = isNaN(estDepartureDetails.estimate[headStationCounter - 1].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate[headStationCounter - 1].minutes) * 60;
                        }
                    }
                    return quickLookup;
                })
            })

        },

        quickLookupDetails: function (indx, destination, trip, stations) {
            return quickLookupFunction(indx, destination, trip, stations);
        }
    }

    function quickLookupFunction(indx, destination, trip, stations) {
        var quickLookup = {};
        quickLookup.destination = destination;
        quickLookup.hasLink = false;
        quickLookup.hasMoreLinks = false;
        quickLookup.id = indx;
        quickLookup.routeFare = trip._fare;
        quickLookup.origTimeMin = trip._origTimeMin;
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
        return quickLookup;
    }
});
