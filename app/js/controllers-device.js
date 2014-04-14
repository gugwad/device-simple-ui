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
    .controller('EditDeviceCtrl', ['$device', '$filter', '$rootScope', '$scope', '$routeParams', '$location',
        function ($device, $filter, $rootScope, $scope, $routeParams, $location) {
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

            $scope.saveDevice = function () {
                $device.updateDevice($scope.device)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/device/" + data["id"]);
                        }
                    });
            };

            $scope.openCalendar = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
        }]);