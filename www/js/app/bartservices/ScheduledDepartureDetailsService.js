angular.module('bartonic')
    .factory('ScheduledDepartureDetailsService', function ($http, $log, ENV) {
        return {
            getScheduledDepartureDetailsObservable: function (origin, destination) {
                //$log.debug("origin is : " + origin, " destination is : " + destination);
                return Rx.Observable.fromPromise($http({
                    method: 'GET',
                    url: ENV.bartBaseURL + '/sched.aspx',
                    params: {cmd: 'depart', b:'0', a:'3', l:'1', orig: origin, dest: destination, key: ENV.bartApiKey}
                }));
            },

            getTrainHeadStations: function (scheduledDepartureDetails) {
                var trainHeadStations = [];
                angular.forEach(scheduledDepartureDetails.root.schedule.request.trip, function (trips) {
                    var trainHeadStation = angular.isArray(trips.leg) ? trips.leg[0]._trainHeadStation : trips.leg._trainHeadStation;
                    if (trainHeadStations.indexOf(trainHeadStation) == -1) {
                        trainHeadStations.push(trainHeadStation);
                    }
                });
                return trainHeadStations;
            }
        }
    });
