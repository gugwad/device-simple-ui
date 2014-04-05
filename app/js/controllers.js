'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers', [])
    .controller('PersonsCtrl', ['$person', '$rootScope', '$scope',
        function ($person, $rootScope, $scope) {
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
    .controller('PersonCtrl', ['$person', '$filter', '$rootScope', '$scope', '$routeParams',
        function ($person, $filter, $rootScope, $scope, $routeParams) {
            $scope.personId = $routeParams.personId;
            $person.getPerson($scope.personId)
                .success(function (data) {
                    $scope.person = data;
                    if (data.hasOwnProperty("gender")) {
                        if (data["gender"] === 'M') {
                            $scope.male = true;
                        } else {
                            $scope.female = true;
                        }
                    }

                    $scope.preferredName = {};
                    if (data.hasOwnProperty('personNames')) {
                        var personNames = data["personNames"];
                        $scope.preferredName = personNames[0];
                        for (var i = 0; i < personNames.length; i++) {
                            var personName = personNames[i];
                            if (personName.hasOwnProperty('preferred')) {
                                var preferred = personName["preferred"];
                                if (preferred === 'true') {
                                    $scope.preferredName = personName;
                                }
                            }
                        }
                    }
                });
        }])
    .controller('DevicesCtrl', ['$device', '$rootScope', '$scope',
        function ($device, $rootScope, $scope) {
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
    .controller('DeviceCtrl', ['$device', '$filter', '$rootScope', '$scope', '$routeParams',
        function ($device, $filter, $rootScope, $scope, $routeParams) {
            $scope.deviceId = $routeParams.deviceId;
            $device.getDevice($scope.deviceId)
                .success(function (data) {
                    $scope.device = data;
                    $scope.groupedDetails = {};
                    var deviceType = data["deviceType"];
                    var deviceDetails = deviceType["deviceDetails"];
                    for (var i = 0; i < deviceDetails.length; i++) {
                        var deviceDetail = deviceDetails[i];
                        var category = deviceDetail["category"];
                        $scope.groupedDetails[category] = $filter('filter')(deviceDetails, {"category": category});
                    }
                });
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