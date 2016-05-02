var QuickLookupCtrl = function ($scope, $filter, $log, $interval, StationsLookupService, QuickLookupService, ScheduledDepartureDetailsService) {

    $scope.stations = [];

    $scope.timeOptions = [
        {title: "Now", checked: true, value: ''},
        {title: "Arrive before", checked: false, value: ''},
        {title: "Depart after", checked: false, value: ''},
    ];

    StationsLookupService.stationsLookupObservable().subscribe(function (response) {
        $scope.stations = response.data.root.stations.station;
    });

    this.updateSelection = function (position, timeOptions, title) {
        angular.forEach(timeOptions, function (timeOption, index) {
                timeOption.value = '';

                if (position != index) {
                    timeOption.checked = false;
                } else if (position === index) {
                    timeOption.checked = true;
                }
            }
        );
    }


    this.showEstimatedDeparture = function () {
        if (this.origin && this.destination) {
            var origin = this.origin.abbr;
            var destination = this.destination.abbr;
            if ($scope.timeOptions[0].checked) {
                $scope.quickLookups = [];
                quickLookUp(origin, destination);
                $interval(function () {
                    quickLookUp(origin, destination);
                }, 60000);
            } else {
                var cmd, date, time, dateTime;
                if ($scope.timeOptions[1].checked) {
                    cmd = "arrive";
                    dateTime = $scope.timeOptions[1].value;
                } else {
                    cmd = "depart";
                    dateTime = $scope.timeOptions[2].value;
                }
                date = dateTime.getMonth() + 1 + "/" + dateTime.getDate() + "/" + dateTime.getFullYear();
                if (dateTime.getHours() >= 12) {
                    time = (dateTime.getHours() === 12 ? dateTime.getHours() : dateTime.getHours() - 12) + ":" + dateTime.getMinutes() + " PM";
                } else {
                    time = (dateTime.getHours() === 0 ? dateTime.getHours() + 12 : dateTime.getHours()) + ":" + dateTime.getMinutes() + " AM";
                }
                var quickLookups = [];

                ScheduledDepartureDetailsService.getScheduledDepartureDetailsObservable(origin, destination, cmd, date, time).subscribe(function (response) {
                    var scheduledDepartureDetails = response.data;
                    angular.forEach(scheduledDepartureDetails.root.schedule.request.trip, function (trip, index) {
                        var quickLookup = QuickLookupService.quickLookupDetails(index, destination, trip, $scope.stations);
                        quickLookup.scheduled = true;
                        quickLookups.push(quickLookup);
                    });
                }, function (err) {
                    $log.error("error occurred calling scheduled departures ", err);
                }, function () {
                    quickLookups = $filter('orderBy')(quickLookups, "estDepartureFlag");
                    $scope.quickLookups = quickLookups;
                    $scope.noservice = true;
                    angular.forEach(quickLookups, function(lookup) {
                       if(lookup.estDeparture) {
                           $scope.noservice = false;
                           return;
                       }
                    });
                    $scope.$apply();
                });
            }
        }
    }

    function quickLookUp(origin, destination) {
        var quickLookups = [];
        QuickLookupService.getEstimatedDeparture(origin, destination, 'depart', 'now', 'now').subscribe(function (quickLookup) {
            quickLookups.push(quickLookup);
        }, function (err) {
            $log.error("error occurred calling estimate departure ", err);
        }, function () {
            $log.debug("completed quickLookUp call");
            quickLookups = $filter('orderBy')(quickLookups, "estDepartureFlag");
            $scope.quickLookups = quickLookups;
            $scope.$apply();
        });
    }
}
angular.module('bartonic.quicklookup').controller('QuickLookupCtrl', QuickLookupCtrl);
