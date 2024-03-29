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
    .controller('PersonCtrl', ['$person', '$user', '$filter', '$rootScope', '$scope', '$routeParams',
        function ($person, $user, $filter, $rootScope, $scope, $routeParams) {

            $scope.editUser = function () {
                $scope.editingUser = true;
                $user.getUser($scope.person.id)
                    .success(function (data) {
                        $scope.user = data;
                        $scope.username = data["username"];
                    }).error(function () {
                        console.log("Unable to find user information!");
                    });
            };

            $scope.cancelEdit = function () {
                $scope.editingUser = false;
            };

            $scope.saveUser = function (username, password, confirmPassword) {
                if (password === confirmPassword) {
                    if ($scope.user == null) {
                        $user.saveUser($scope.personId, username, password)
                            .success(function () {
                                $scope.editingUser = false;
                            }).error(function () {
                                console.log("Unable to save user information!");
                            });
                    } else {
                        $user.updateUser($scope.personId, username, password)
                            .success(function () {
                                $scope.editingUser = false;
                            }).error(function () {
                                console.log("Unable to save user information!");
                            });
                    }
                }
            };

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
                        $scope.preferredName = $rootScope.getPreferredName($scope.person);
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
                    $scope.preferredName = $rootScope.getPreferredName($scope.person);
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
                        $scope.preferredName = $rootScope.getPreferredName($scope.person);
                        angular.forEach($scope.person["personNames"], function (personName) {
                            personName.active = false;
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
