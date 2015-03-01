angular.module('bartionic.quicklookup')
    .factory('QuickLookupService', function ($resource, poller, ENV) {
        var stationsDeferredResponse = {};
        var departureTimeDeferredResponse = {};
        return {
            stationsDeferredRequest: function () {
                stationsDeferredResponse = getStations();
                return stationsDeferredResponse;
            },

            getStationsDeferredResponse: function () {
                return stationsDeferredResponse;
            },

            departureTimeDeferredRequest : function (origin){
                departureTimeDeferredResponse = getRealTimeDeparture(origin);
                return departureTimeDeferredResponse;
            },

            getDepartureTimeDeferredResponse: function () {
                return departureTimeDeferredResponse;
            }

        }

        function getStations() {
            var stationsEndpoint = ENV.bartBaseURL + '/stn.aspx?cmd=stns&key=' + ENV.bartApiKey;
            var stationsResource = $resource(stationsEndpoint, {}, {query: {method: 'GET', isArray: false}});
            return stationsResource.query();
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
