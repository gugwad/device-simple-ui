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

        $scope.$on('authorization:invalid', function () {
            $scope.authorizationInvalid = true;
        });
    }])
    .controller('NavCtrl', ['$window', '$user', '$rootScope', '$scope', function ($window, $user, $rootScope, $scope) {

        $scope.logout = function () {
            $scope.$emit('authorization:logout');
        };

        var updateState = function () {
            var username = $window.sessionStorage["username"];
            $scope.isNotAuthenticated = (username == null || username == undefined);
            if (!$scope.isNotAuthenticated) {
                $scope.authenticatedUser = username;
                var object = $window.sessionStorage["user"];
                if (object != null && object != undefined) {
                    var stringObject = JSON.parse(object);
                    var givenName = stringObject["givenName"];
                    var familyName = stringObject["familyName"];
                    $scope.authenticatedUser = $scope.authenticatedUser + " - " + givenName + " " + familyName;
                }
            }
        };

        $scope.$on('$routeChangeStart', function () {
            // TODO hacky stuff goes here :)
            updateState();
        })
    }])
    .controller('MessageCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $scope.authorizationDenied = false;
        $scope.$on('authorization:denied', function () {
            $scope.authorizationDenied = true;
        })
    }]);
