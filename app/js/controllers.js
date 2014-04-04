'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers', [])
    .controller('PersonsCtrl', ['$person', '$rootScope', '$scope', function ($person, $rootScope, $scope) {
        $rootScope.navigation = "person";
        $scope.count = 0;
        $scope.pageSize = 10;
        $rootScope.currentPage = 1;
        $person.searchPerson($scope.search, $scope.pageSize, $rootScope.currentPage)
            .success(function (data) {
                $scope.persons = data.results;
                $scope.count = data.count;
            });

        $scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $person.searchPerson($scope.search, $scope.pageSize, newValue)
                    .success(function (data) {
                        $scope.persons = data.results;
                        $scope.count = data.count;
                    });
            }
        }, true);

        $scope.$watch('search', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $rootScope.currentPage = 1;
                $person.searchPerson(newValue, $scope.pageSize, $rootScope.currentPage)
                    .success(function (data) {
                        $scope.persons = data.results;
                        $scope.count = data.count;
                    });
            }
        }, true);
    }])
    .controller('PersonCtrl', ['$person', '$rootScope', '$scope', '$routeParams', function ($person, $rootScope, $scope, $routeParams) {
        $scope.personId = $routeParams.personId;
        $person.getPerson($scope.personId)
            .success(function (data) {
                $scope.person = data
            });
    }])
    .controller('DevicesCtrl', ['$device', '$rootScope', '$scope', function ($device, $rootScope, $scope) {
        $rootScope.navigation = "device";
        $scope.count = 0;
        $scope.pageSize = 10;
        $rootScope.currentPage = 1;
        $device.searchDevice($scope.search, $scope.pageSize, $rootScope.currentPage)
            .success(function (data) {
                $scope.devices = data.results;
                $scope.count = data.count;
            });

        $scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $device.searchDevice($scope.search, $scope.pageSize, newValue)
                    .success(function (data) {
                        $scope.devices = data.results;
                        $scope.count = data.count;
                    });
            }
        }, true);

        $scope.$watch('search', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $rootScope.currentPage = 1;
                $device.searchDevice(newValue, $scope.pageSize, $rootScope.currentPage)
                    .success(function (data) {
                        $scope.devices = data.results;
                        $scope.count = data.count;
                    });
            }
        }, true);
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