var MapCtrl = function ($scope, $window, $log, $ionicScrollDelegate) {
    //$log.debug($window.innerWidth);
    //$log.debug($window.innerHeight);

    $scope.mapStyle = {
        "width": $window.innerWidth + "px",
        "height": $window.innerHeight - 90 + "px"
    };

    this.resetMap = function () {
        $ionicScrollDelegate.zoomTo(1);
    }
}

angular.module('bartonic.map').controller('MapCtrl', MapCtrl);

