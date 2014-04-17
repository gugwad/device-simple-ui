'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers')
    .controller('DeviceTypesCtrl', ['$deviceType', '$rootScope', '$scope', '$location',
        function ($deviceType, $rootScope, $scope, $location) {
            // initialize the list of items to empty object (with count = 0 obviously)
            $scope.deviceTypes = {};
            // initialize the paging information
            $scope.count = 0;
            $scope.pageSize = 10;
            $rootScope.currentPage = 1;
            // initialize the name of the navigation
            $rootScope.navigation = "deviceType";

            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue === '') {
                        $scope.count = 0;
                        $scope.deviceTypes = {};
                    } else {
                        $deviceType.searchDeviceType($scope.search, $scope.pageSize, newValue)
                            .success(function (data) {
                                $scope.count = data.count;
                                $scope.deviceTypes = data.results;
                            });
                    }
                }
            }, true);

            $scope.$watch('search', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue === '') {
                        $scope.count = 0;
                        $scope.deviceTypes = {};
                    } else {
                        $rootScope.currentPage = 1;
                        $deviceType.searchDeviceType(newValue, $scope.pageSize, $rootScope.currentPage)
                            .success(function (data) {
                                $scope.count = data.count;
                                $scope.deviceTypes = data.results;
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

            $scope.saveDevice = function () {
                $deviceType.updateDevice($scope.device)
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
