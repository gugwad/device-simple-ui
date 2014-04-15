'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers')
    .controller('DeviceTypesCtrl', ['$deviceType', '$rootScope', '$scope', '$location',
        function ($deviceType, $rootScope, $scope, $location) {
            $rootScope.navigation = "deviceType";
            $scope.count = 0;
            $scope.pageSize = 10;
            $rootScope.currentPage = 1;
            $deviceType.searchDeviceType($scope.search, $scope.pageSize, $rootScope.currentPage)
                .success(function (data) {
                    $scope.deviceTypes = data.results;
                    $scope.count = data.count;
                });

            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $deviceType.searchDeviceType($scope.search, $scope.pageSize, newValue)
                        .success(function (data) {
                            $scope.deviceTypes = data.results;
                            $scope.count = data.count;
                        });
                }
            }, true);

            $scope.$watch('search', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue === '') {
                        $scope.deviceTypes = {};
                        $scope.count = 0;
                    } else {
                        $rootScope.currentPage = 1;
                        $deviceType.searchDeviceType(newValue, $scope.pageSize, $rootScope.currentPage)
                            .success(function (data) {
                                $scope.deviceTypes = data.results;
                                $scope.count = data.count;
                            });
                    }
                }
            }, true);

            $scope.redirectCreateDeviceType = function() {
                $location.path("/deviceType/");
            }
        }])
    .controller('DeviceTypeCtrl', ['$deviceType', '$filter', '$rootScope', '$scope', '$routeParams',
        function ($deviceType, $filter, $rootScope, $scope, $routeParams) {
            $scope.deviceTypeId = $routeParams.deviceTypeId;
            $deviceType.getDeviceType($scope.deviceTypeId)
                .success(function (data) {
                    $scope.deviceType = data;
                    $scope.groupedDetails = {};
                    var deviceDetails = data["deviceDetails"];
                    for (var i = 0; i < deviceDetails.length; i++) {
                        var deviceDetail = deviceDetails[i];
                        var category = deviceDetail["category"];
                        $scope.groupedDetails[category] = $filter('filter')(deviceDetails, {"category": category});
                    }
                });
        }])
    .controller('CreateDeviceTypeCtrl', ['$deviceType', '$filter', '$rootScope', '$scope', '$location',
        function ($deviceType, $filter, $rootScope, $scope, $location) {

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
    .controller('EditDeviceTypeCtrl', ['$deviceType', '$filter', '$rootScope', '$scope', '$routeParams', '$location',
        function ($deviceType, $filter, $rootScope, $scope, $routeParams, $location) {
            $scope.deviceTypeId = $routeParams.deviceTypeId;
            $deviceType.getDeviceType($scope.deviceTypeId)
                .success(function (data) {
                    $scope.deviceType = data;
                    $scope.groupedDetails = {};
                    var deviceDetails = data["deviceDetails"];
                    for (var i = 0; i < deviceDetails.length; i++) {
                        var deviceDetail = deviceDetails[i];
                        var category = deviceDetail["category"];
                        $scope.groupedDetails[category] = $filter('filter')(deviceDetails, {"category": category});
                    }
                });

            $scope.saveDevice = function () {
                $deviceType.updateDeviceType($scope.deviceType)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/deviceType/" + data["id"]);
                        }
                    });
            };
        }]);
