'use strict';

angular.
  module('twigbro.statView').
  component('statView', {
    templateUrl: 'stat-view/stat-view.template.html',
    controller: ['StatService',

      function StatViewController($StatService) {

        // var API_KEY = "AIzaSyCYa7ZwoXJUYaApV9Xmz_mxWKfbtHEOjSM";
        var createChart = function () {

          var chart = {
            type: "GeoChart",
            cssStyle: "width: 800px; height: 400px;",
            options: {
              width: 1000,
              height: 700,
              chartArea: { left: 10, top: 10, bottom: 0, width: "100%" },
              region: 'US',
              displayMode: 'markers',
              colorAxis: { colors: ['blue', 'red'] },
              backgroundColor: '#81d4fa'
            }
            // , formatters: {
            //   number: [{
            //     columnNum: 1,
            //     pattern: "$ #,##0.00"
            //   }]
            // }
          }

          return chart;
        };

        var chart = createChart();
        chart.data = $StatService.getData();

        this.chart = chart;
      }
    ]
  });