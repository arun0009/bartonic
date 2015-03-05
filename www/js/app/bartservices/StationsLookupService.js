angular.module('bartionic')
    .factory('StationsLookupService', function ($resource, ENV) {
        var stationsDeferredResponse = {};
        return {
            stationsDeferredRequest: function () {
                stationsDeferredResponse = getStations();
                return stationsDeferredResponse;
            },

            getStationsDeferredResponse: function () {
                return stationsDeferredResponse;
            }
        }

        function getStations() {
            var stationsEndpoint = ENV.bartBaseURL + '/stn.aspx?cmd=stns&key=' + ENV.bartApiKey;
            var stationsResource = $resource(stationsEndpoint, {}, {query: {method: 'GET', isArray: false, cache: true}});
            return stationsResource.query();
        }
    });
