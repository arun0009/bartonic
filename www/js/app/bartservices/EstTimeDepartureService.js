angular.module('bartonic')
    .factory('EstTimeDepartureService', function ($resource, $log, ScheduledDepartureDetailsService, ENV) {
        var departureTimeDeferredResponse = {};
        return {
            departureTimeDeferredRequest : function (origin){
                departureTimeDeferredResponse = getRealTimeDeparture(origin);
                return departureTimeDeferredResponse;
            },

            getDepartureTimeDeferredResponse: function () {
                return departureTimeDeferredResponse;
            }
        }

        function getRealTimeDeparture(origin) {
            $log.debug("origin is : " + origin);
            var realTimeDepartureEndpoint = ENV.bartBaseURL + '/etd.aspx?cmd=etd&orig=' + origin + '&key=' + ENV.bartApiKey;
            var realTimeDepartureResource = $resource(realTimeDepartureEndpoint, {}, {query: {method: 'GET', isArray: false}});
            return realTimeDepartureResource.query();
        }
    });
