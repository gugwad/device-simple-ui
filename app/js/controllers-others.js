'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers')
    .controller('SettingsCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "setting";
    }])
    .controller('HelpCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "help";
    }])
    .controller('HomeCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "home";
    }])
    .controller('LoginCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "login";
        $scope.authorizationInvalid = false;
        $scope.login = function () {
            $scope.$emit('authorization:authenticate', $scope.username, $scope.password);
        };

        $scope.$on('authorization:invalid', function() {
            $scope.authorizationInvalid = true;
        });
    }])
    .controller('NavCtrl', ['$window', '$rootScope', '$scope', function ($window, $rootScope, $scope) {

        $scope.logout = function () {
            $scope.$emit('authorization:logout');
        };

        var updateState = function() {
            $scope.notAuthenticated = ($window.sessionStorage["user"] == null
                || $window.sessionStorage["user"] === 'undefined'
                || $window.sessionStorage["user"] === 'null');

            var givenName, familyName;
            if (!$scope.notAuthenticated) {
                var object = $window.sessionStorage["user"];
                if (object != null && object !== 'null' && object !== 'undefined') {
                    var stringObject = JSON.parse(object);
                    givenName = stringObject["givenName"];
                    familyName = stringObject["familyName"]
                }
            }
            $scope.authenticatedUser = givenName + " " + familyName;
        };

        $scope.$on('$routeChangeStart', function() {
            // TODO hacky stuff goes here :)
            updateState();
        });

    }]);