'use strict';


// Declare app level module which depends on filters, and services
var muzimaDevice = angular.module('muzimaDevice', ['ngRoute', 'muzimaDevice.filters', 'muzimaDevice.services', 'muzimaDevice.directives', 'muzimaDevice.controllers', 'ui.bootstrap']);

muzimaDevice.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/person/:personId', {templateUrl: 'partials/person.html', controller: 'PersonCtrl'});
    $routeProvider.when('/persons', {templateUrl: 'partials/persons.html', controller: 'PersonsCtrl'});
    $routeProvider.when('/device/:deviceId', {templateUrl: 'partials/device.html', controller: 'DeviceCtrl'});
    $routeProvider.when('/devices', {templateUrl: 'partials/devices.html', controller: 'DevicesCtrl'});
    $routeProvider.when('/deviceType/:deviceTypeId', {templateUrl: 'partials/deviceType.html', controller: 'DeviceTypeCtrl'});
    $routeProvider.when('/deviceTypes', {templateUrl: 'partials/deviceTypes.html', controller: 'DeviceTypesCtrl'});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
    $routeProvider.when('/help', {templateUrl: 'partials/help.html', controller: 'HelpCtrl'});
    $routeProvider.otherwise('/person');
}]);

muzimaDevice.value("$dataProvider", "http://localhost:8080/device-simple");
muzimaDevice.service('$person', function($http, $dataProvider) {
    var searchPerson = function(search, pageSize, currentPage) {
        return $http.get($dataProvider + "/api/person?query=" + search + "&max=" + pageSize + "&offset=" + (pageSize * (currentPage - 1)));
    };
    var getPerson = function(personId) {
        return $http.get($dataProvider + "/api/person/" + personId);
    };
    return {
        searchPerson: searchPerson,
        getPerson: getPerson
    }
});

muzimaDevice.service('$device', function($http, $dataProvider) {
    var searchDevice = function(search, pageSize, currentPage) {
        return $http.get($dataProvider + "/api/device?query=" + search + "&max=" + pageSize + "&offset=" + (pageSize * (currentPage - 1)));
    };
    var getDevice = function(personId) {
        return $http.get($dataProvider + "/api/device/" + personId);
    };
    return {
        searchDevice: searchDevice,
        getDevice: getDevice
    }
});

muzimaDevice.run(function ($http) {
    $http.defaults.headers.common['Accept'] = "application/json";
    $http.defaults.headers.common['Content-Type'] = "application/json";
});