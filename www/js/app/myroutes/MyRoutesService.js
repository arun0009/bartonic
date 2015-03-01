angular.module('bartionic.myroutes')
    .factory('MyRoutesService', function ($resource, poller, ENV) {
        var departureTimeDeferredResponse = {};
        return {
            departureTimeDeferredRequest: function (origin) {
                departureTimeDeferredResponse = getRealTimeDeparture(origin);
                return departureTimeDeferredResponse;
            },

            getDepartureTimeDeferredResponse: function () {
                return departureTimeDeferredResponse;
            }

        }

        function getRealTimeDeparture(origin) {
            var realTimeDepartureEndpoint = ENV.bartBaseURL + '/etd.aspx?cmd=etd&orig=' + origin + '&key=' + ENV.bartApiKey;
            var realTimeDepartureResource = $resource(realTimeDepartureEndpoint, {}, {myQuery: {method: 'GET', isArray: false}});
            // Get poller.
            var realTimeDeparturePoller = poller.get(realTimeDepartureResource, {
                action: 'myQuery',
                delay: 30000
            });
            return realTimeDeparturePoller;
        }
    });
