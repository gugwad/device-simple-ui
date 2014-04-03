'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers', [])
    .controller('PersonsCtrl', ['apiLocation', '$http', '$rootScope', '$scope', function (apiLocation, $http, $rootScope, $scope) {
        $rootScope.person = true;
        $http.get(apiLocation + "/api/person")
            .success(function (data) {
                $scope.persons = data.results;
            });
    }])
    .controller('PersonCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.person = true;
    }])
    .controller('DeviceCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.device = true;
    }])
    .controller('SettingCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.setting = true;
    }])
    .controller('HelpCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.help = true;
    }]);