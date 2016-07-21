'use strict';

angular.
  module('twigbro.statView').
  component('statView', {
    templateUrl: 'stat-view/stat-view.template.html',
    controller: ['$routeParams', 'StatService',

      function StatViewController($routeParams, StatService) {

        
        // var API_KEY = "AIzaSyCYa7ZwoXJUYaApV9Xmz_mxWKfbtHEOjSM";
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
              colorAxis: { colors: ['blue', 'red'] },
              backgroundColor: '#81d4fa',
            },
            formatters: {
              number: [{
                columnNum: 1,
                pattern: "0%"
              }]
            },
            data: [
              ['City', 'Clinton', 'Total'],
              ['Boston', 0, 0]
            ]
          }

          return chart;
        };

        this.hasData = true;
        this.chart = createChart();


        var self = this;
        StatService.getVotes($routeParams.name).then(function (data) {
          var chart = createChart();
          chart.data = data;
          self.hasData = chart.data.length > 1;
          self.chart = chart;
        });
      }
    ]
  });