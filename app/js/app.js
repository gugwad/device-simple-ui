'use strict';


// Declare app level module which depends on filters, and services
var muzimaDevice = angular.module('muzimaDevice', ['ngRoute', 'muzimaDevice.filters', 'muzimaDevice.services', 'muzimaDevice.directives', 'muzimaDevice.controllers']);

muzimaDevice.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/person', {templateUrl: 'partials/person.html', controller: 'PersonCtrl'});
    $routeProvider.when('/persons', {templateUrl: 'partials/persons.html', controller: 'PersonsCtrl'});
    $routeProvider.when('/device', {templateUrl: 'partials/device.html', controller: 'DeviceCtrl'});
    $routeProvider.when('/setting', {templateUrl: 'partials/setting.html', controller: 'SettingCtrl'});
    $routeProvider.when('/help', {templateUrl: 'partials/help.html', controller: 'HelpCtrl'});
    $routeProvider.otherwise('/person');
}]);

muzimaDevice.value("apiLocation", "http://localhost:8080/device-simple");
muzimaDevice.run(function ($http) {
    $http.defaults.headers.common['Accept'] = "application/json";
    $http.defaults.headers.common['Content-Type'] = "application/json";
});