angular.module('bartonic')
    .factory('EstTimeDepartureService', function ($http, $log, ScheduledDepartureDetailsService, ENV) {
        return {
            getEstTimeDepartureObservable: function (origin) {
                //$log.debug("origin is : " + origin);
                return Rx.Observable.fromPromise($http({
                    method: 'GET',
                    url: ENV.bartBaseURL + '/etd.aspx',
                    params: {cmd: 'etd', orig: origin, key: ENV.bartApiKey}
                }));
            },

            getEstimatedDeparturesForHeadStations: function (estTimeDeparture, trainHeadStations) {
                var estDepartureDetails = [];
                if (angular.isArray(estTimeDeparture.root.station.etd)) {
                    angular.forEach(estTimeDeparture.root.station.etd, function (estTimeDepature) {
                        if (trainHeadStations.indexOf(estTimeDepature.abbreviation) != -1) {
                            estDepartureDetails.push(estTimeDepature)
                        }
                    })
                } else {
                    estDepartureDetails.push(estTimeDeparture.root.station.etd);
                }
                return estDepartureDetails;
            },

            compareDepartureTimes: function (a, b) {
                var a_departureTime = angular.isArray(a.estimate) ? a.estimate[0].minutes : a.estimate.minutes;
                a_departureTime = isNaN(a_departureTime) ? 0 : a_departureTime;
                var b_departureTime = angular.isArray(b.estimate) ? b.estimate[0].minutes : b.estimate.minutes;
                b_departureTime = isNaN(b_departureTime) ? 0 : b_departureTime;
                //$log.debug(a_departureTime + " and " + b_departureTime);
                if (a_departureTime < b_departureTime)
                    return -1;
                else if (a_departureTime > b_departureTime)
                    return 1;
                else
                    return 0;
            }
        }
    });
