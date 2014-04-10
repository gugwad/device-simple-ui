'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers')
    .controller('DeviceTypesCtrl', ['$deviceType', '$rootScope', '$scope',
        function ($deviceType, $rootScope, $scope) {
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
                    $rootScope.currentPage = 1;
                    $deviceType.searchDeviceType(newValue, $scope.pageSize, $rootScope.currentPage)
                        .success(function (data) {
                            $scope.deviceTypes = data.results;
                            $scope.count = data.count;
                        });
                }
            }, true);
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
        }]);
