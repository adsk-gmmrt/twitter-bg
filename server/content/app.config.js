'use strict';

angular.
  module('twigbro.main').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {

      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/map', {
          templateUrl: 'map-view/map-view.template.html'
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
