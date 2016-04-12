var InfoCtrl = function ($scope, $log, AdvisoryService) {

    AdvisoryService.advisoryObservable().subscribe(
        function (response) {
            $scope.advisoryTitle = "Service Advisories :"
            if (angular.isDefined(response.data.root.bsa)) {
                if (response.data.root.bsa.type === "DELAY" || response.data.root.bsa.type === "EMERGENCY") {
                    $scope.badgeCount = 1;
                    $scope.advisory = response.data.root.bsa.description.__cdata
                }
            } else {
                $scope.advisory = "All trains are running as per schedule."
            }
        },
        function (err) {
            $scope.advisory = "All trains are running as per schedule."
            $log.error(err);
        });
}

angular.module('bartonic.info').controller('InfoCtrl', InfoCtrl);

