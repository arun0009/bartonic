var AddRouteCtrl = function ($scope, $rootScope, $state, $ionicPlatform, AddRouteService) {

    this.getStations = function () {
        AddRouteService.stationsDeferredRequest().$promise.then(function (response) {
            console.log(angular.toJson(response.root.stations));
           $scope.stations = response.root.stations;
        }), function (err) {
            console.error("Exception occurred in retrieving stations: " + err.message);
        };
    }
}
angular.module('bartionic.addroute').controller('AddRouteCtrl', AddRouteCtrl);
