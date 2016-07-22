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
          template: '<stat-view></stat-view>'
        }).
        when('/main', {
          templateUrl: 'index.template.html'
        }).
        otherwise('/map');
    }
  ]);
