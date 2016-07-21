'use strict';

angular.module('twigbro.statView')
  .factory('StatService', ['$http',

    function ($http) {

      var getVotes = function (name) {

        return $http({
          method: 'GET',
          url: '/api/v1/aggregate'
        }).then(function successCallback(response) {

          var data = [];
          var cityData = response.data;

          var keyClinton = 'to';
          var keyTrump = 'of';

          var validName = name[0].toUpperCase() + name.slice(1);

          var votesHeader = 'Votes for ' + validName;
          var votesKey;

          var output = [
            [
              'City',
              votesHeader,
              'Total votes'
            ]
          ]

          if (validName === 'Clinton') {
            votesKey = keyClinton;
          } else if (validName === 'Trump') {
            votesKey = keyTrump;
          }

          if (votesKey !== undefined) {
            for (var city in cityData) {
              var totalVotes = cityData[city][keyClinton] + cityData[city][keyTrump];
              if (totalVotes > 0) {
                output.push([city, cityData[city][votesKey] / totalVotes, totalVotes]);
              }
            }
          }

          return output;

        }, function errorCallback(response) {
          var r = response;
        });
      }

      return {
        getVotes: getVotes,
      }

    }]);