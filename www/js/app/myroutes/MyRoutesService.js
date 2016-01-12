angular.module('bartonic.myroutes').factory('MyRoutesService', function() {
    var myRoute = {};
    return {
        setMyRoute: function(route) {
            myRoute = route;
        },

        getMyRoute: function() {
            return myRoute;
        }
    };
});
