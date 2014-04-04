'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers', [])
    .controller('PersonsCtrl', ['apiLocation', '$http', '$rootScope', '$scope', function (apiLocation, $http, $rootScope, $scope) {
        $rootScope.navigation = "person";
        $scope.count = 0;
        $scope.pageSize = 10;
        $rootScope.currentPage = 1;
        $http.get(apiLocation + "/api/person?query=" + $scope.search + "&max=" + $scope.pageSize + "&offset=" + ($scope.pageSize * ($rootScope.currentPage - 1)))
            .success(function (data) {
                $scope.persons = data.results;
                $scope.count = data.count;
            });

        $scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $http.get(apiLocation + "/api/person?query=" + $scope.search + "&max=" + $scope.pageSize + "&offset=" + ($scope.pageSize * (newValue - 1)))
                    .success(function (data) {
                        $scope.persons = data.results;
                        $scope.count = data.count;
                    });
            }
        }, true);

        $scope.$watch('search', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $rootScope.currentPage = 1;
                $http.get(apiLocation + "/api/person?query=" + $scope.search + "&max=" + $scope.pageSize + "&offset=" + ($scope.pageSize * ($rootScope.currentPage - 1)))
                    .success(function (data) {
                        $scope.persons = data.results;
                        $scope.count = data.count;
                    });
            }
        }, true);
    }])
    .controller('PersonCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "person";
    }])
    .controller('DevicesCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "device";
    }])
    .controller('DeviceCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "device";
    }])
    .controller('DeviceTypesCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "deviceTypes";
    }])
    .controller('SettingsCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "settings";
    }])
    .controller('HelpCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "help";
    }]);