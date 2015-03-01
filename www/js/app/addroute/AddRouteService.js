angular.module('bartionic.addroute')
    .factory('AddRouteService', function ($resource, ENV) {
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
            console.log(stationsEndpoint);
            var stationsResource = $resource(stationsEndpoint, {}, {query: {method: 'GET', isArray: false}});
            return stationsResource.query();
        }
    });
