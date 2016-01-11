angular.module('bartonic')
    .factory('EstTimeDepartureService', function ($resource, ScheduledDepartureDetailsService, ENV) {
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
            console.log("origin is : " + origin);
            var realTimeDepartureEndpoint = ENV.bartBaseURL + '/etd.aspx?cmd=etd&orig=' + origin + '&key=' + ENV.bartApiKey;
            var realTimeDepartureResource = $resource(realTimeDepartureEndpoint, {}, {query: {method: 'GET', isArray: false}});
            return realTimeDepartureResource.query();
        }


    });
