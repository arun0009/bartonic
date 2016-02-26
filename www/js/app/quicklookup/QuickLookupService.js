angular.module('bartonic.quicklookup').factory('QuickLookupService', function ($filter, $q, $log, ScheduledDepartureDetailsService, EstTimeDepartureService) {

    return {
        getEstimatedDeparture: function (stations, origin, destination) {
            var quickLookups = [];
            var deferred = $q.defer();
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

                    EstTimeDepartureService.departureTimeDeferredRequest(origin).$promise.then(function (estTimeDeparture) {
                        $log.debug("quickLookup.trainHeadStation is : ", quickLookup.trainHeadStation);
                        var estDepartureDetails = angular.isArray(estTimeDeparture.root.station.etd) ? $filter('filter')(estTimeDeparture.root.station.etd, {abbreviation: quickLookup.trainHeadStation}, true) : estTimeDeparture.root.station.etd;
                        if (estDepartureDetails != null) {
                            if (angular.isArray(estDepartureDetails)) {
                                $log.debug("array is : ", angular.toJson(estDepartureDetails));
                                estDepartureDetails = estDepartureDetails[0];
                            }
                            if (angular.isArray(estDepartureDetails.estimate)) {
                                $log.debug("quicklookups ==> ", angular.toJson(quickLookups) + " and trainHead is " + quickLookup.trainHeadStation);
                                var indx = $filter('filter') (quickLookups, {trainHeadStation: quickLookup.trainHeadStation});
                                $log.debug("array of est Departure is : ", angular.toJson(estDepartureDetails.estimate));
                                quickLookup.carLength = estDepartureDetails.estimate[indx.length].length;
                                quickLookup.estDeparture = isNaN(estDepartureDetails.estimate[indx.length].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate[indx.length].minutes) * 60;
                            } else {
                                quickLookup.carLength = estDepartureDetails.estimate.length;
                                quickLookup.estDeparture = isNaN(estDepartureDetails.estimate.minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails.estimate.minutes) * 60;
                            }
                        }
                        quickLookups.push(quickLookup);
                    });
                    deferred.resolve(quickLookups);
                });


            }), function (err) {
                $log.error("Exception occurred in getting schedule : " + err);
                deferred.reject(quickLookups);
            }
            return deferred.promise;
        }
    }
});
