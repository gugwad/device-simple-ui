'use strict';


// Declare app level module which depends on filters, and services
var muzimaDevice = angular.module('muzimaDevice', ['ngRoute', 'ui.bootstrap',
    'muzimaDevice.filters', 'muzimaDevice.services', 'muzimaDevice.directives', 'muzimaDevice.controllers']);

muzimaDevice.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/person', {templateUrl: 'partials/createPerson.html', controller: 'CreatePersonCtrl'});
    $routeProvider.when('/person/:personId', {templateUrl: 'partials/person.html', controller: 'PersonCtrl'});
    $routeProvider.when('/person/:personId/edit', {templateUrl: 'partials/editPerson.html', controller: 'EditPersonCtrl'});
    $routeProvider.when('/persons', {templateUrl: 'partials/persons.html', controller: 'PersonsCtrl'});
    $routeProvider.when('/device/', {templateUrl: 'partials/createDevice.html', controller: 'CreateDeviceCtrl'});
    $routeProvider.when('/device/:deviceId', {templateUrl: 'partials/device.html', controller: 'DeviceCtrl'});
    $routeProvider.when('/device/:deviceId/edit', {templateUrl: 'partials/editDevice.html', controller: 'EditDeviceCtrl'});
    $routeProvider.when('/devices', {templateUrl: 'partials/devices.html', controller: 'DevicesCtrl'});
    $routeProvider.when('/deviceType/', {templateUrl: 'partials/createDeviceType.html', controller: 'CreateDeviceTypeCtrl'});
    $routeProvider.when('/deviceType/:deviceTypeId', {templateUrl: 'partials/deviceType.html', controller: 'DeviceTypeCtrl'});
    $routeProvider.when('/deviceType/:deviceTypeId/edit', {templateUrl: 'partials/editDeviceType.html', controller: 'EditDeviceTypeCtrl'});
    $routeProvider.when('/deviceTypes', {templateUrl: 'partials/deviceTypes.html', controller: 'DeviceTypesCtrl'});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
    $routeProvider.when('/help', {templateUrl: 'partials/help.html', controller: 'HelpCtrl'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

muzimaDevice.value("$dataProvider", "http://localhost:8080/device-simple");
muzimaDevice.service('$person', function ($http, $dataProvider) {
    var searchPerson = function (search, pageSize, currentPage) {
        return $http({
            method: "GET",
            params: {
                query: search,
                max: pageSize,
                offset: (pageSize * (currentPage - 1))
            },
            url: $dataProvider + "/api/person"
        });
    };
    var getPerson = function (personId) {
        return $http.get($dataProvider + "/api/person/" + personId);
    };
    var updatePerson = function (person) {
        return $http({
            method: "PUT",
            data: person,
            url: $dataProvider + "/api/person/" + person.id
        });
    };
    var savePerson = function (person) {
        return $http({
            method: "POST",
            data: person,
            url: $dataProvider + "/api/person"
        });
    };
    return {
        searchPerson: searchPerson,
        getPerson: getPerson,
        updatePerson: updatePerson,
        savePerson: savePerson
    }
});

muzimaDevice.service('$device', function ($http, $dataProvider) {
    var searchDevice = function (search, pageSize, currentPage) {
        return $http({
            method: "GET",
            params: {
                query: search,
                max: pageSize,
                offset: (pageSize * (currentPage - 1))
            },
            url: $dataProvider + "/api/device"
        });
    };
    var getDevice = function (deviceId) {
        return $http.get($dataProvider + "/api/device/" + deviceId);
    };
    var updateDevice = function (device) {
        return $http({
            method: "PUT",
            data: device,
            url: $dataProvider + "/api/device/" + device.id
        });
    };
    var saveDevice = function (device) {
        return $http({
            method: "POST",
            data: device,
            url: $dataProvider + "/api/device"
        });
    };
    return {
        searchDevice: searchDevice,
        getDevice: getDevice,
        updateDevice: updateDevice,
        saveDevice: saveDevice
    }
});

muzimaDevice.service('$user', function ($http, $dataProvider) {
    var getCurrentUser = function () {
        return $http.get($dataProvider + "/api/user");
    };

    var saveUser = function (personId, username, password) {
        return $http({
            method: "POST",
            data: {
                id: personId,
                username: username,
                password: password
            },
            url: $dataProvider + "/api/user"
        });
    };

    var updateUser = function (personId, username, password) {
        return $http({
            method: "PUT",
            data: {
                id: personId,
                username: username,
                password: password
            },
            url: $dataProvider + "/api/user/" + personId
        });
    };

    var getUser = function (personId) {
        return $http.get($dataProvider + "/api/user/" + personId);
    };
    return {
        getCurrentUser: getCurrentUser,
        updateUser: updateUser,
        saveUser: saveUser,
        getUser: getUser
    }
});

muzimaDevice.service('$deviceType', function ($http, $dataProvider) {
    var searchDeviceType = function (search, pageSize, currentPage) {
        return $http({
            method: "GET",
            params: {
                query: search,
                max: pageSize,
                offset: (pageSize * (currentPage - 1))
            },
            url: $dataProvider + "/api/deviceType"
        });
    };
    var getDeviceType = function (deviceTypeId) {
        return $http.get($dataProvider + "/api/deviceType/" + deviceTypeId);
    };
    var updateDeviceType = function (deviceType) {
        return $http({
            method: "PUT",
            data: deviceType,
            url: $dataProvider + "/api/deviceType/" + deviceType.id
        });
    };
    var saveDeviceType = function (deviceType) {
        return $http({
            method: "POST",
            data: deviceType,
            url: $dataProvider + "/api/deviceType"
        });
    };
    return {
        searchDeviceType: searchDeviceType,
        getDeviceType: getDeviceType,
        updateDeviceType: updateDeviceType,
        saveDeviceType: saveDeviceType
    }
});

muzimaDevice.service('$assignment', function ($http, $dataProvider) {
    var searchAssignment = function (deviceId, personId) {
        return $http({
            method: "GET",
            params: {
                deviceId: deviceId,
                personId: personId
            },
            url: $dataProvider + "/api/assignment"
        })
    };
    var updateAssignment = function (assignment) {
        return $http({
            method: "PUT",
            data: assignment,
            url: $dataProvider + "/api/assignment/" + assignment.id
        });
    };
    var saveAssignment = function (assignment) {
        return $http({
            method: "POST",
            data: assignment,
            url: $dataProvider + "/api/assignment"
        });
    };
    return {
        searchAssignment: searchAssignment,
        updateAssignment: updateAssignment,
        saveAssignment: saveAssignment
    }
});

muzimaDevice.service('$message', function ($http, $dataProvider) {
    var sendCommand = function (deviceId, command) {
        return $http({
            method: "GET",
            params: {
                deviceId: deviceId,
                command: command
            },
            url: $dataProvider + "/api/message"
        })
    };
    return {
        sendCommand: sendCommand
    }
});

muzimaDevice.run(function ($http) {
    $http.defaults.headers.common['Accept'] = "application/json";
    $http.defaults.headers.common['Content-Type'] = "application/json";
});

muzimaDevice.run(function ($rootScope) {
    $rootScope.numericalOrder = function (number) {
        switch (number) {
            case 1:
                return "First";
                break;
            case 2:
                return "Second";
                break;
            case 3:
                return "Third";
                break;
            case 4:
                return "Fourth";
                break;
            default:
                return "Other";
        }
    };

    $rootScope.getPreferredName = function (person) {
        var preferredName = {};
        if (person.hasOwnProperty("personNames")) {
            preferredName = person["personNames"][0];
            angular.forEach(person["personNames"], function (personName) {
                if (personName.hasOwnProperty('preferred')) {
                    var preferred = personName["preferred"];
                    if (preferred === 'true') {
                        preferredName = personName;
                    }
                }
            });
        }
        return preferredName;
    };

    $rootScope.getPreferredAddress = function (person) {
        var preferredAddress = {};
        if (person.hasOwnProperty("personAddresses")) {
            preferredAddress = person["personAddresses"][0];
            angular.forEach(person["personAddresses"], function (personAddress) {
                if (personAddress.hasOwnProperty('preferred')) {
                    var preferred = personAddress["preferred"];
                    if (preferred === 'true') {
                        preferredAddress = personAddress;
                    }
                }
            });
        }
        return preferredAddress;
    };

    $rootScope.getProperty = function (object, property) {
        if (object.hasOwnProperty(property)) {
            if (object[property] != null && object[property] !== '') {
                return object[property];
            }
        }
        return '';
    };

    $rootScope.createName = function (preferredName) {
        var name = $rootScope.getProperty(preferredName, "familyName");
        name = name + ", " + $rootScope.getProperty(preferredName, "givenName");
        name = name + " " + $rootScope.getProperty(preferredName, "middleName");
        return name;
    };
});

muzimaDevice.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $rootScope, $window) {
        console.log("Calling registered interceptor ...");
        return {
            'request': function (config) {
                var username = $window.sessionStorage["username"];
                var isNotAuthenticated = (username == null || username == undefined);
                var isNotAuthenticationRedirect = (config.url.indexOf("login") == -1);
                if (isNotAuthenticated) {
                    if (isNotAuthenticationRedirect) {
                        var deferred = $q.defer();
                        $rootScope.request = {
                            config: config,
                            deferred: deferred
                        };
                        $rootScope.$broadcast('authorization:request');
                        return deferred.promise;
                    }
                } else {
                    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + $window.sessionStorage["authorization"];
                }
                // do something on success
                return config || $q.when(config);
            },
            // optional method
            'responseError': function (rejection) {
                // in case we need to intercept response error and do something with it
                if (rejection.status == 403) {
                    $rootScope.$broadcast('authorization.denied');
                }
                if (rejection.status == 401) {
                    var deferred = $q.defer();
                    $rootScope.request = {
                        config: rejection.config,
                        deferred: deferred
                    };
                    $rootScope.$broadcast('authorization:request');
                    $rootScope.$broadcast('authorization:invalid');
                    return deferred.promise;
                }
                return $q.reject(rejection);
            }
        };
    });
}]);

muzimaDevice.run(function ($rootScope, $route, $http, $location, $window, $dataProvider) {
    $http.defaults.headers.common['Accept'] = "application/json";
    $http.defaults.headers.common['Content-Type'] = "application/json";

    /**
     * Pool of all failed request.
     */
    $rootScope.path = null;

    $rootScope.$on('authorization:request', function () {
        console.log("Authorization requested ...");
        var authorization = $window.sessionStorage["authorization"];
        delete $window.sessionStorage["authorization"];
        if (authorization == null || authorization === 'undefined' || authorization === 'null') {
            $http.defaults.headers.common['Authorization'] = null;
            $location.path("/login");
        }
    });

    /**
     * When authorization information is accepted, execute all the pooled request.
     */
    $rootScope.$on('authorization:confirmed', function () {
        console.log("Authorization accepted ...");
        $http.defaults.headers.common['Authorization'] =  'Bearer ' + $window.sessionStorage["authorization"];
        $http.get($dataProvider + "/api/user")
            .success(function (data) {
                $window.sessionStorage["user"] = JSON.stringify(data);
                if ($rootScope.path == null || $rootScope.path === 'null' || $rootScope.path === 'undefined') {
                    $location.path("/home");
                    $route.reload();
                } else {
                    $location.path($rootScope.path);
                    $route.reload();
                }
                $rootScope.path = null;
            });
    });

    /**
     * Send the authorization information to the server and check the status returned by the server
     */
    $rootScope.$on('authorization:authenticate', function (event, username, password) {
        console.log('Sending authorization information for event ...');
        $http({
            method: 'POST',
            url: $dataProvider + '/api/login',
            data: {
                username: username,
                password: password
            },
            headers: {
                'Accept': ['text/json', 'application/json']
            }
        }).success(function (data) {
            $window.sessionStorage["username"] = data["username"];
            $window.sessionStorage["authorization"] = data["access_token"];
            $rootScope.$broadcast('authorization:confirmed');
        }).error(function (data) {
            console.log("Unable to authenticate.", data);
            $rootScope.$broadcast('authorization:logout');
        });
    });

    /**
     * Remove authorization information from the header
     */
    $rootScope.$on('authorization:logout', function () {
        console.log("Removing authorization information ...");
        $http.defaults.headers.common['Authorization'] =  'Bearer ' + $window.sessionStorage["authorization"];
        $http({
            method: 'POST',
            url: $dataProvider + '/api/logout',
            headers: {
                'Accept': ['text/json', 'application/json']
            }
        }).then(function () {
            delete $window.sessionStorage["username"];
            delete $window.sessionStorage["authorization"];
            delete $http.defaults.headers.common['Authorization'];
            $location.path('/login');
        });
    });

    $rootScope.$on('$routeChangeStart', function (event, next) {
        // preventing the login redirect looping
        var nextRoute = next["originalPath"];
        if (nextRoute != '/login') {
            $rootScope.path = nextRoute;
        }
    });
});