'use strict';

/* Device Controllers */

angular.module('muzimaDevice.controllers')
    .controller('DevicesCtrl', ['$device', '$rootScope', '$scope', '$location',
        function ($device, $rootScope, $scope, $location) {
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

            $scope.redirectCreateDevice = function() {
                $location.path("/device");
            };
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
    .controller('CreateDeviceCtrl', ['$device', '$deviceType', '$filter', '$rootScope', '$scope', '$location',
        function ($device, $deviceType, $filter, $rootScope, $scope, $location) {

            $scope.device = {};

            var search = "";
            $deviceType.searchDeviceType(search, 100, 1)
                .success(function (data) {
                    $scope.deviceTypes = data.results;
                });

            $scope.saveDevice = function () {
                var purchasedDate = $scope.device["purchasedDate"];
                if (purchasedDate instanceof Date && !isNaN(purchasedDate.valueOf())) {
                    $scope.device["purchasedDate"] = purchasedDate.getTime();
                }
                $device.updateDevice($scope.device)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/device/" + data["id"]);
                        }
                    });
            };
        }])
    .controller('EditDeviceCtrl', ['$device', '$deviceType', '$filter', '$rootScope', '$scope', '$routeParams', '$location',
        function ($device, $deviceType, $filter, $rootScope, $scope, $routeParams, $location) {
            $scope.device = {};
            $scope.format = "dd-MMM-yyyy";
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

            $scope.$watch('device.deviceType', function(newValue, oldValue) {
                if (newValue != oldValue) {

                }
            });

            var search = "";
            $deviceType.searchDeviceType(search, 100, 1)
                .success(function (data) {
                    $scope.deviceTypes = data.results;
                });

            $scope.saveDevice = function () {
                var purchasedDate = $scope.device["purchasedDate"];
                if (purchasedDate instanceof Date && !isNaN(purchasedDate.valueOf())) {
                    $scope.device["purchasedDate"] = purchasedDate.getTime();
                }
                $device.updateDevice($scope.device)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/device/" + data["id"]);
                        }
                    });
            };
        }]);