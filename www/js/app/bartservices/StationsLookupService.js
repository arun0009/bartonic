angular.module('bartonic')
    .factory('StationsLookupService', function ($http, ENV) {
        return {
            stationsLookupObservable: function () {
                return Rx.Observable.fromPromise($http({
                    method: 'GET',
                    cache: true,
                    url: ENV.bartBaseURL + '/stn.aspx',
                    params: {cmd: 'stns', key: ENV.bartApiKey}
                }));
            },

            getStationsDeferredResponse: function () {
                return stationsDeferredResponse;
            }
        }
    });
