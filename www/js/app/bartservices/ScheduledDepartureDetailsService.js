angular.module('bartonic')
    .factory('ScheduledDepartureDetailsService', function ($http, $log, ENV) {
        return {
            getScheduledDepartureDetailsObservable: function (origin, destination, cmd, date, time) {
                //$log.debug("origin is : " + origin, " destination is : " + destination);
                var b = (cmd === 'depart') ? '0' : '3';
                var a = (cmd === 'depart') ? '3' : '0';
                return Rx.Observable.fromPromise($http({
                    method: 'GET',
                    url: ENV.bartBaseURL + '/sched.aspx',
                    params: {cmd: cmd, b: b, a: a, l:'1', orig: origin, dest: destination, date: date, time:time, key: ENV.bartApiKey}
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
