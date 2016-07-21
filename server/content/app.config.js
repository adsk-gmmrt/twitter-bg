'use strict';

angular.
  module('twigbro.main').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/map', {
          template: '<map-view></map-view>'
        }).
        when('/stat', {
          redirectTo: 'stat/clinton'
        }).
        when('/stat/:name', {
          template: '<stat-view></stat-view>'
        }).
        otherwise('/map');
    }
  ]);