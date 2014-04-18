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

            $scope.redirectCreateDeviceType = function () {
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
                    if ($scope.deviceType.hasOwnProperty("deviceDetails")) {
                        var categories = [];
                        var deviceDetails = $scope.deviceType["deviceDetails"];
                        // get all the categories
                        angular.forEach(deviceDetails, function (deviceDetail) {
                            var category = deviceDetail["category"];
                            var filteredCategories = $filter('filter')(categories, {"name": category});
                            if (filteredCategories.length == 0) {
                                categories.push({
                                    name: category
                                });
                            }
                        });

                        $scope.categories = $filter('orderBy')(categories, 'name');
                        angular.forEach($scope.categories, function (category) {
                            $scope.groupedDetails[category.name] = $filter('filter')(deviceDetails, {"category": category.name});
                        });
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
            $scope.deviceType = {};
            // will hold mapping from the category to the list of device details
            $scope.groupedDetails = {};
            // will hold the category and the active toggle used by the tab directive
            $scope.categories = [];
            $scope.deviceTypeId = $routeParams.deviceTypeId;
            $deviceType.getDeviceType($scope.deviceTypeId)
                .success(function (data) {
                    $scope.deviceType = data;
                    if ($scope.deviceType.hasOwnProperty("deviceDetails")) {
                        var categories = [];
                        var deviceDetails = $scope.deviceType["deviceDetails"];
                        // get all the categories
                        angular.forEach(deviceDetails, function (deviceDetail) {
                            var category = deviceDetail["category"];
                            var filteredCategories = $filter('filter')(categories, {"name": category});
                            if (filteredCategories.length == 0) {
                                categories.push({
                                    name: category,
                                    active: false
                                });
                            }
                        });

                        angular.forEach(categories, function (category) {
                            $scope.groupedDetails[category.name] = $filter('filter')(deviceDetails, {"category": category.name});
                        });

                        $scope.categories = $filter('orderBy')(categories, 'name');
                        $scope.categories[0].active = true;
                    }
                });

            $scope.addCategory = function () {
                angular.forEach($scope.categories, function (category) {
                    category.active = false;
                });
                $scope.categories.push({
                    name: "New Category",
                    active: true
                });
                $scope.groupedDetails["New Category"] = [];
            };

            // when adding the sub category, we need to find the active header
            // and then push new element to array of that active headers in the grouped details map
            $scope.addSubCategory = function () {
                var activeCategories = $filter('filter')($scope.categories, {"active": true});
                angular.forEach(activeCategories, function (activeCategory) {
                    $scope.groupedDetails[activeCategory.name].push({});
                });
            };

            // need to watch if user are changing the categories headers
            // need to change the headers of the grouped details then
            $scope.$watch('categories', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var oldActiveCategories = $filter('filter')(oldValue, {"active": true});
                    var newActiveCategories = $filter('filter')(newValue, {"active": true});
                    // the above array will contain only one element
                    angular.forEach(oldActiveCategories, function (oldActiveCategory) {
                        angular.forEach(newActiveCategories, function (newActiveCategory) {
                            var newActiveCategoryName = newActiveCategory.name;
                            var oldActiveCategoryName = oldActiveCategory.name;
                            if ($filter('filter')(oldValue, {"name": newActiveCategoryName}).length == 0
                                || $filter('filter')(newValue, {"name": oldActiveCategoryName}).length == 0) {
                                if (newActiveCategoryName.length == 0) {
                                    $scope.groupedDetails["_BLANK_"] = $scope.groupedDetails[oldActiveCategory.name];
                                    delete $scope.groupedDetails[oldActiveCategory.name];
                                } else if (oldActiveCategoryName.length == 0) {
                                    $scope.groupedDetails[newActiveCategory.name] = $scope.groupedDetails["_BLANK_"];
                                    delete $scope.groupedDetails["_BLANK_"];
                                } else {
                                    $scope.groupedDetails[newActiveCategory.name] = $scope.groupedDetails[oldActiveCategory.name];
                                    delete $scope.groupedDetails[oldActiveCategory.name];
                                }
                            }
                        });
                    });
                }
            }, true);

            $scope.saveDeviceType = function () {
                var deviceDetails = [];
                angular.forEach($scope.groupedDetails, function (values, key) {
                    angular.forEach(values, function (value) {
                        value["category"] = key;
                        deviceDetails.push(value);
                    });
                });
                $scope.deviceType["deviceDetails"] = deviceDetails;
                $deviceType.updateDeviceType($scope.deviceType)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/deviceType/" + data["id"]);
                        }
                    });
            };
        }]);
