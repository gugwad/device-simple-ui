'use strict';

/* Controllers */

angular.module('muzimaDevice.controllers', [])
    .controller('HomeCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "home";
    }])
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
            $scope.edit = false;
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
    .controller('EditPersonCtrl', ['$person', '$filter', '$rootScope', '$scope', '$routeParams', '$location',
        function ($person, $filter, $rootScope, $scope, $routeParams, $location) {
            $scope.person = {};
            $scope.format = "dd-MMM-yyyy";
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
                    if ($scope.person.hasOwnProperty('personNames')) {
                        $scope.preferredName = $scope.person["personNames"][0];
                        angular.forEach($scope.person["personNames"], function (personName) {
                            personName.active = false;
                            if (personName.hasOwnProperty('preferred')) {
                                var preferred = personName["preferred"];
                                if (preferred === 'true') {
                                    $scope.preferredName = personName;
                                }
                            }
                        });
                        // make the first tab as active
                        $scope.person["personNames"][0].active = true;
                    }
                    if ($scope.person.hasOwnProperty("personAddresses")) {
                        angular.forEach($scope.person["personAddresses"], function (personAddress) {
                            personAddress.active = false;
                        });
                        // make the first tab as active
                        $scope.person["personAddresses"][0].active = true;
                    }
                });
            $scope.addPersonName = function () {
                if ($scope.person.hasOwnProperty("personNames")) {
                    angular.forEach($scope.person["personNames"], function (personName) {
                        personName.active = false;
                    });
                    $scope.person["personNames"].push({
                        active: true
                    });
                }
            };
            $scope.addPersonAddress = function () {
                if ($scope.person.hasOwnProperty("personAddresses")) {
                    angular.forEach($scope.person["personAddresses"], function (personAddress) {
                        personAddress.active = false;
                    });
                    $scope.person["personAddresses"].push({
                        active: true
                    });
                }
            };
            $scope.savePerson = function () {
                $person.updatePerson($scope.person)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/person/" + data["id"]);
                        }
                    });
            };
            $scope.openCalendar = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
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

            $scope.savePerson = function () {
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
        }])
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
        }])
    .controller('SettingsCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "setting";
    }])
    .controller('HelpCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $rootScope.navigation = "help";
    }]);