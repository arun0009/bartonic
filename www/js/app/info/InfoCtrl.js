var InfoCtrl = function ($scope, $log, AdvisoryService) {

    AdvisoryService.advisoryObservable().subscribe(
        function (response) {
            $scope.advisoryTitle = "Service Advisories :"
            if (angular.isDefined(response.data.root.bsa) && angular.isDefined(response.data.root.bsa.type)) {
                if (response.data.root.bsa.type === "DELAY" || response.data.root.bsa.type === "EMERGENCY") {
                    $scope.badgeCount = 1;
                    $scope.advisory = response.data.root.bsa.description.__cdata
                }
            } else {
                $scope.advisory = "No delays reported."
            }
        });
}

angular.module('bartonic.info').controller('InfoCtrl', InfoCtrl);

