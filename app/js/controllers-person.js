'use strict';

/* Person Controllers */

angular.module('muzimaDevice.controllers')
    .controller('PersonsCtrl', ['$person', '$rootScope', '$scope', '$location',
        function ($person, $rootScope, $scope, $location) {
            // initialize the paging information
            $scope.count = 0;
            $scope.pageSize = 10;
            $rootScope.currentPage = 1;
            // initialize the list of person
            $scope.persons = {};
            // initialize the navigation information
            $rootScope.navigation = "person";

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

            $scope.redirectCreatePerson = function() {
                $location.path("/person");
            };
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
    .controller('CreatePersonCtrl', ['$person', '$filter', '$rootScope', '$scope', '$location',
        function ($person, $filter, $rootScope, $scope, $location) {

            $scope.person = {};
            $scope.person["personNames"] = [
                {
                    active: true
                }
            ];
            $scope.person["personAddresses"] = [
                {
                    active: true
                }
            ];

            $scope.$watch('person["gender"]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue === 'M') {
                        $scope.male = true;
                        $scope.female = false;
                    } else if (newValue === 'F') {
                        $scope.female = true;
                        $scope.male = false;
                    }
                }
            }, true);

            $scope.$watch('person["personNames"]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.preferredName = $scope.person["personNames"][0];
                    angular.forEach($scope.person["personNames"], function (personName) {
                        if (personName.hasOwnProperty('preferred')) {
                            var preferred = personName["preferred"];
                            if (preferred === 'true') {
                                $scope.preferredName = personName;
                            }
                        }
                    });
                }
            }, true);

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
                var birthdate = $scope.person["birthdate"];
                if (birthdate instanceof Date && !isNaN(birthdate.valueOf())) {
                    $scope.person["birthdate"] = birthdate.getTime();
                }
                $person.savePerson($scope.person)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/person/" + data["id"]);
                        }
                    });
            };
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

            $scope.$watch('person["gender"]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue === 'M') {
                        $scope.male = true;
                        $scope.female = false;
                    } else if (newValue === 'F') {
                        $scope.female = true;
                        $scope.male = false;
                    }
                }
            }, true);

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
                var birthdate = $scope.person["birthdate"];
                if (birthdate instanceof Date && !isNaN(birthdate.valueOf())) {
                    $scope.person["birthdate"] = birthdate.getTime();
                }
                $person.updatePerson($scope.person)
                    .success(function (data) {
                        if (data.hasOwnProperty("id")) {
                            $location.path("/person/" + data["id"]);
                        }
                    });
            };
        }]);
