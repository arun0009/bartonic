angular.module('bartonic')
    .factory('AdvisoryService', function ($http, ENV) {
        return {
            advisoryObservable: function () {
                return Rx.Observable.fromPromise($http({
                    method: 'GET',
                    cache: true,
                    url: ENV.bartBaseURL + '/bsa.aspx',
                    params: {cmd: 'bsa', date: 'today', key: ENV.bartApiKey}
                }));
            }
        }
    });
