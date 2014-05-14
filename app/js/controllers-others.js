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
        $scope.logout = function() {
            $scope.$emit('authentication:logout');
        }
    }])
    .controller('LoginCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "login";
        $scope.submit = function() {
            $scope.$emit('authorization:authenticate', $scope.username, $scope.password);
        }
    }]);