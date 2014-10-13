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
    .controller('DeviceCtrl', ['$device', '$person', '$assignment', '$message', '$filter', '$rootScope', '$scope', '$routeParams',
        function ($device, $person, $assignment, $message, $filter, $rootScope, $scope, $routeParams) {
            $scope.device = {};
            $scope.assignment = {};
            $scope.groupedDetails = {};
            $scope.deviceId = $routeParams.deviceId;
            $device.getDevice($scope.deviceId)
                .success(function (data) {
                    $scope.device = data;
                    // device details will be grouped by the category
                    // device detail have: { category, subCategory, categoryValue}
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
                            angular.forEach(data.results, function(item) {
                                $scope.assignment = item;
                                if ($scope.assignment.hasOwnProperty("person")) {
                                    var person = $scope.assignment["person"];
                                    $scope.preferredName = $rootScope.getPreferredName(person);
                                    var name = $rootScope.createName($scope.preferredName);
                                    $scope.person = {
                                        id: person["id"],
                                        name: name
                                    };

                                }
                            });
                        });
                });

            $scope.lockDevice = function() {
                $message.sendCommand($scope.device.id, "LOCK_DEVICE");
            };

            $scope.unlockDevice = function() {
                $message.sendCommand($scope.device.id, "UNLOCK_DEVICE");
            };

            $scope.wipeDevice = function() {
                $message.sendCommand($scope.device.id, "WIPE_DEVICE");
            };

            $scope.unlinkDevice = function() {
                $message.sendCommand($scope.device.id, "UNREGISTER_DEVICE");
            };

            $scope.editAssignment = function () {
                $scope.assigningDevice= true;
            };

            $scope.searchPerson = function (search) {
                return $person.searchPerson(search)
                    .then(function (data) {
                        var persons = [];
                        angular.forEach(data.data.results, function(item) {
                            var preferredName = $rootScope.getPreferredName(item);
                            var name = $rootScope.createName(preferredName);
                            persons.push({
                                id: item["id"],
                                name: name
                            });
                        });
                        return persons;
                    });
            };

            $scope.cancelAssignment = function () {
                $scope.assigningDevice = false;
            };

            $scope.saveAssignment = function () {
                $scope.assignment["device"] = $scope.device;
                $scope.assignment["person"] = $scope.person;
                if ($scope.assignment.hasOwnProperty("id")) {
                    $assignment.updateAssignment($scope.assignment)
                        .success(function (data) {
                            $scope.assigningDevice = false;
                            $scope.assignment = data;
                            if ($scope.assignment.hasOwnProperty("person")) {
                                var person = $scope.assignment["person"];
                                $scope.preferredName = $rootScope.getPreferredName(person)
                            }
                        });
                } else {
                    $assignment.saveAssignment($scope.assignment)
                        .success(function (data) {
                            $scope.assigningDevice = false;
                            $scope.assignment = data;
                            if ($scope.assignment.hasOwnProperty("person")) {
                                var person = $scope.assignment["person"];
                                $scope.preferredName = $rootScope.getPreferredName(person)
                            }
                        });
                }
            };
        }])
    .controller('CreateDeviceCtrl', ['$device', '$deviceType', '$person', '$assignment', '$filter', '$rootScope', '$scope', '$location',
        function ($device, $deviceType, $person, $assignment, $filter, $rootScope, $scope, $location) {

            $scope.device = {};
            $scope.assignment = {};
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

            $scope.searchPerson = function (search) {
                return $person.searchPerson(search)
                    .then(function (data) {
                        var persons = [];
                        angular.forEach(data.data.results, function(item) {
                            var preferredName = $rootScope.getPreferredName(item);
                            var name = $rootScope.createName(preferredName);
                            persons.push({
                                id: item["id"],
                                name: name
                            });
                        });
                        return persons;
                    });
            };

            $scope.saveDevice = function () {
                var purchasedDate = $scope.device["purchasedDate"];
                if (purchasedDate instanceof Date && !isNaN(purchasedDate.valueOf())) {
                    $scope.device["purchasedDate"] = purchasedDate.getTime();
                }
                $device.saveDevice($scope.device)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $scope.assignment["device"] = data;
                            if ($scope.hasOwnProperty("person")) {
                                $scope.assignment["person"] = $scope.person;
                                if ($scope.assignment.hasOwnProperty("id")) {
                                    $assignment.updateAssignment($scope.assignment).then(function () {
                                        $location.path("/device/" + data["id"]);
                                    });
                                } else {
                                    $assignment.saveAssignment($scope.assignment).then(function () {
                                        $location.path("/device/" + data["id"]);
                                    });
                                }
                            } else {
                                $location.path("/device/" + data["id"]);
                            }
                        }
                    });
            };
        }])
    .controller('EditDeviceCtrl', ['$device', '$deviceType', '$person', '$assignment', '$filter', '$rootScope', '$scope', '$routeParams', '$location',
        function ($device, $deviceType, $person, $assignment, $filter, $rootScope, $scope, $routeParams, $location) {

            $scope.device = {};
            $scope.assignment = {};
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

                    $assignment.searchAssignment($scope.device["id"])
                        .success(function (data) {
                            angular.forEach(data.results, function(item) {
                                $scope.assignment = item;
                                if ($scope.assignment.hasOwnProperty("person")) {
                                    var person = $scope.assignment["person"];
                                    $scope.preferredName = $rootScope.getPreferredName(person);
                                    var name = $rootScope.createName($scope.preferredName);
                                    $scope.person = {
                                        id: person["id"],
                                        name: name
                                    };

                                }
                            });
                        });
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

            $scope.searchPerson = function (search) {
                return $person.searchPerson(search)
                    .then(function (data) {
                        var persons = [];
                        angular.forEach(data.data.results, function(item) {
                            var preferredName = $rootScope.getPreferredName(item);
                            var name = $rootScope.createName(preferredName);
                            persons.push({
                                id: item["id"],
                                name: name
                            });
                        });
                        return persons;
                    });
            };

            $scope.updateDevice = function () {
                var purchasedDate = $scope.device["purchasedDate"];
                if (purchasedDate instanceof Date && !isNaN(purchasedDate.valueOf())) {
                    $scope.device["purchasedDate"] = purchasedDate.getTime();
                }
                $device.updateDevice($scope.device)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $scope.assignment["device"] = data;
                            if ($scope.hasOwnProperty("person")) {
                                $scope.assignment["person"] = $scope.person;
                                if ($scope.assignment.hasOwnProperty("id")) {
                                    $assignment.updateAssignment($scope.assignment).then(function () {
                                        $location.path("/device/" + data["id"]);
                                    });
                                } else {
                                    $assignment.saveAssignment($scope.assignment).then(function () {
                                        $location.path("/device/" + data["id"]);
                                    });
                                }
                            } else {
                                $location.path("/device/" + data["id"]);
                            }
                        }
                    });
            };
        }]);