'use strict';

angular.module('twigbro.statView')
  .factory('StatService', ['$http',

    function ($http) {

      var createChart = function () {

        var chart = {
          type: "GeoChart",
          options: {
            width: 800,
            height: 400,
            chartArea: { left: 10, top: 10, bottom: 10, right: 10, width: "100%" },
            legend: 'none',
            region: 'US',
            displayMode: 'markers',
            colorAxis: { colors: ['red', 'blue'] },
            backgroundColor: '#cce6ff',
            sizeAxis: { maxSize: 25 }
          },
          formatters: {
            number: [{
              columnNum: 3,
              pattern: "0%"
            }]
          },
          data: getEmptyData()
        }

        return chart;
      };

      var getEmptyData = function () {
        return [
          ['latitude', 'longitude'],
          [0, 0]
        ];
      }


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
            ['latitude', 'longitude', 'City', 'Clinton mentioned in', 'of all election tweets'],
          ]

          var cities = ['City'];

          for (var cityname in cityData) {
            var city = cityData[cityname];
            var totalVotes = city[keyClinton] + city[keyTrump];
            if (totalVotes > 0) {
              cities.push(cityname);
              output.push([city.location.latitude, city.location.longitude, cityname, city[keyClinton] / totalVotes, totalVotes]);
            }
          }

          if (cities.length === 1) {
            output = getEmptyData();
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
        getVotes: getVotes,
      }

    }]);