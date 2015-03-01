angular.module('bartionic.myroutes')
    .factory('MyRoutesService', function ($rootScope, ENV) {
        var authenticateUserDeferredResponse = {};
        return {
            authenticateUserDeferredRequest: function (username, password) {
                console.log("username is : " + username + " and password is : " + password);
                authenticateUserDeferredResponse = {};
                $rootScope.username = username;
                return authenticateUserDeferredResponse;
            },

            getAuthenticateUserDeferredResponse: function () {
                return authenticateUserDeferredResponse;
            }
        }
    });
