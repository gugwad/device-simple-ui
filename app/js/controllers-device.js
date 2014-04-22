'use strict';

/* Device Controllers */

angular.module('muzimaDevice.controllers')
    .controller('DevicesCtrl', ['$device', '$rootScope', '$scope', '$location',
        function ($device, $rootScope, $scope, $location) {
            // initialize the paging information
            $scope.count = 0;
            $scope.pageSize = 10;
            $rootScope.currentPage = 1;
            // initialize the device list
            $scope.devices = {};
            // initialize the navigation information
            $rootScope.navigation = "device";
            // need to watch the current page
            // * update the list when user press the paging navigation part
            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $device.searchDevice($scope.search, $scope.pageSize, newValue)
                        .success(function (data) {
                            $scope.count = data.count;
                            $scope.devices = data.results;
                        });
                }
            }, true);
            // need to watch the search field
            // * update the list when user enter search term
            $scope.$watch('search', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $rootScope.currentPage = 1;
                    $device.searchDevice(newValue, $scope.pageSize, $rootScope.currentPage)
                        .success(function (data) {
                            $scope.count = data.count;
                            $scope.devices = data.results;
                        });
                }
            }, true);

            $scope.redirectCreateDevice = function () {
                $location.path("/device");
            };
        }])
    .controller('DeviceCtrl', ['$device', '$person', '$assignment', '$filter', '$rootScope', '$scope', '$routeParams',
        function ($device, $person, $assignment, $filter, $rootScope, $scope, $routeParams) {
            $scope.device = {};
            $scope.assignment = {};
            $scope.deviceId = $routeParams.deviceId;
            $device.getDevice($scope.deviceId)
                .success(function (data) {
                    $scope.device = data;
                    // device details will be grouped by the category
                    // device detail have: { category, subCategory, categoryValue}
                    $scope.groupedDetails = {};
                    var deviceType = data["deviceType"];
                    if (deviceType.hasOwnProperty("deviceDetails")) {
                        var categories = [];
                        var deviceDetails = deviceType["deviceDetails"];
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
                            $scope.groupedDetails[category["name"]] = $filter('filter')(deviceDetails, {"category": category["name"]});
                        });
                    }
                    $assignment.searchAssignment($scope.device["id"])
                        .success(function (data) {
                            $scope.assignment = data.results;
                        });
                });

            $scope.editAssignment = function () {
                $scope.assign = true;
            };

            var getProperty = function(object, property) {
                var value = "";
                if (object.hasOwnProperty(property)) {
                    if (object[property] != null && object[property] !== '') {
                        return object[property];
                    }
                }
                return value;
            };

            $scope.searchPerson = function (search) {
                return $person.searchPerson(search)
                    .then(function (data) {
                        var persons = [];
                        angular.forEach(data.data.results, function(item) {
                            var name = "";
                            if (item.hasOwnProperty("personNames")) {
                                var preferredName = item["personNames"][0];
                                angular.forEach(item["personNames"], function (personName) {
                                    if (personName.hasOwnProperty('preferred')) {
                                        var preferred = personName["preferred"];
                                        if (preferred === 'true') {
                                            preferredName = personName;
                                        }
                                    }
                                });

                                name = getProperty(preferredName, "familyName");
                                name = name + ", " + getProperty(preferredName, "givenName");
                                name = name + " " + getProperty(preferredName, "middleName");
                            }
                            persons.push({
                                id: item["id"],
                                name: name
                            });
                        });
                        return persons;
                    });
            };

            $scope.cancelAssignment = function () {
                $scope.assign = false;
            };

            $scope.saveAssignment = function() {
                if (!$scope.assignment.hasOwnProperty("device")) {
                    $scope.assignment["device"] = {};
                    $scope.assignment.device["id"] = $scope.device["id"];
                }
                console.log($assignment);
                $assignment.saveAssignment($scope.assignment)
                    .success(function (data) {
                        $scope.assignment = data;
                    });
            };
        }])
    .controller('CreateDeviceCtrl', ['$device', '$deviceType', '$filter', '$rootScope', '$scope', '$location',
        function ($device, $deviceType, $filter, $rootScope, $scope, $location) {

            $scope.device = {};
            $scope.groupedDetails = {};

            $scope.searchDeviceType = function (search) {
                return $deviceType.searchDeviceType(search, 10, 1)
                    .then(function (data) {
                        var deviceTypes = [];
                        angular.forEach(data.data.results, function (item) {
                            deviceTypes.push({
                                id: item.id,
                                name: item.name,
                                description: item.description,
                                deviceDetails: item.deviceDetails
                            });
                        });
                        return deviceTypes;
                    });
            };

            $scope.$watch('device.deviceType', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue.hasOwnProperty("deviceDetails")) {
                        var categories = [];
                        var deviceDetails = newValue["deviceDetails"];
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
                            $scope.groupedDetails[category["name"]] = $filter('filter')(deviceDetails, {"category": category["name"]});
                        });
                    } else {
                        $scope.groupedDetails = {};
                    }
                }
            });

            $scope.saveDevice = function () {
                var purchasedDate = $scope.device["purchasedDate"];
                if (purchasedDate instanceof Date && !isNaN(purchasedDate.valueOf())) {
                    $scope.device["purchasedDate"] = purchasedDate.getTime();
                }
                $device.saveDevice($scope.device)
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
            $scope.groupedDetails = {};

            $scope.deviceId = $routeParams.deviceId;
            $device.getDevice($scope.deviceId)
                .success(function (data) {
                    $scope.device = data;
                    $scope.groupedDetails = {};
                    var deviceType = data["deviceType"];
                    if (deviceType.hasOwnProperty("deviceDetails")) {
                        var categories = [];
                        var deviceDetails = deviceType["deviceDetails"];
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
                            $scope.groupedDetails[category["name"]] = $filter('filter')(deviceDetails, {"category": category["name"]});
                        });
                    }
                });

            $scope.searchDeviceType = function (search) {
                return $deviceType.searchDeviceType(search, 10, 1)
                    .then(function (data) {
                        var deviceTypes = [];
                        angular.forEach(data.data.results, function (item) {
                            deviceTypes.push({
                                id: item.id,
                                name: item.name,
                                description: item.description,
                                deviceDetails: item.deviceDetails
                            });
                        });
                        return deviceTypes;
                    });
            };

            $scope.$watch('device.deviceType', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue.hasOwnProperty("deviceDetails")) {
                        var categories = [];
                        var deviceDetails = newValue["deviceDetails"];
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
                            $scope.groupedDetails[category["name"]] = $filter('filter')(deviceDetails, {"category": category["name"]});
                        });
                    } else {
                        $scope.groupedDetails = {};
                    }
                }
            });

            $scope.updateDevice = function () {
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