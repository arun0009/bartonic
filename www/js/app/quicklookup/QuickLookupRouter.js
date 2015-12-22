angular.module('bartonic.quicklookup', ['ionic', 'ngResource'])
    .config(function ($stateProvider) {
        $stateProvider.state('tab.quicklookup', {
            url: '/quicklookup',
            cache: false,
            views: {
                'tab-quicklookup': {
                    controller: 'QuickLookupCtrl as quicklookup',
                    templateUrl: 'js/app/quicklookup/quicklookup.html'
                }
            }
        })
    });
