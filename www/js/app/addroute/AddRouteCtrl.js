var AddRouteCtrl = function ($scope, $state) {

    this.addRouteToFavorites = function () {
        var favoriteRoutes =  JSON.parse(window.localStorage.getItem('favoriteRoutes')) || [];
        var index = favoriteRoutes.length;
        favoriteRoutes.push({index: ++index, originAbbr: this.origin.abbr, originName: this.origin.name, destinationAbbr: this.destination.abbr, destinationName: this.destination.name});
        if(this.reverseDirection){
            favoriteRoutes.push({index: ++index, originAbbr: this.destination.abbr, originName: this.destination.name, destinationAbbr: this.origin.abbr, destinationName: this.origin.name});
        }
        window.localStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
        console.log(JSON.stringify(favoriteRoutes));
        $state.go("tab.myroutes", {}, {reload: true});
    }

    this.cancelAddRoute = function () {
        $state.go("tab.myroutes");
    }
}
angular.module('bartonic.addroute').controller('AddRouteCtrl', AddRouteCtrl);
