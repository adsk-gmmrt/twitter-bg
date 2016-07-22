'use strict';

angular.module('twigbro.statView')
  .factory('StatService', ['$http',

    function ($http) {

      var createChart = function () {

        var chart = {
          type: "GeoChart",
          cssStyle: "width: 800px; height: 400px;",
          options: {
            width: 1000,
            height: 700,
            chartArea: { left: 10, top: 10, bottom: 0, width: "100%" },
            legend: { numberFormat: "0%" },
            region: 'US',
            displayMode: 'markers',
            colorAxis: { colors: ['red', 'blue'] },
            backgroundColor: '#81d4fa',
          },
          formatters: {
            number: [{
              columnNum: 2,
              pattern: "0%"
            }]
          },
          data: [
            ['latitude', 'longitude'],
            [0, 0]
          ]
        }

        return chart;
      };


      var getVotes = function () {

        return $http({
          method: 'GET',
          url: '/api/v1/aggregate'
        }).then(function successCallback(response) {

          var data = [];
          var cityData = response.data;

          var keyClinton = 'clinton';
          var keyTrump = 'trump';

          var output = [
            [
              'latitude',
              'longitude',
              'Votes for Clinton',
              'Total votes'
            ]
          ]

          var cities = [['City']];

          for (var cityname in cityData) {
            var city = cityData[cityname];
            var totalVotes = city[keyClinton] + city[keyTrump];
            if (totalVotes > 0) {
              cities.push(cityname);
              output.push([city.location.latitude, city.location.longitude, city[keyClinton] / totalVotes, totalVotes]);
            }
          }

          return {
            "cities": cities,
            "data": output
          }

        }, function errorCallback(response) {
          var r = response;
        });
      }

      return {
        createChart: createChart,
        getVotes: getVotes
      }

    }]);