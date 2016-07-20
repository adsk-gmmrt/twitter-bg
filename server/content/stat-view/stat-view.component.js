'use strict';

angular.
  module('twigbro.statView').
  component('statView', {
    templateUrl: 'stat-view/stat-view.template.html',
    controller: [

      function StatViewController($scope) {

        var chart1 = {};
        chart1.type = "GeoChart";
        chart1.cssStyle = "width: 800px; height: 400px;";
        chart1.data = [
          ['Locale', 'Count', 'Percent'],
          ['Germany', 22, 23],
          ['United States', 34, 11],
          ['Brazil', 42, 11],
          ['Canada', 57, 32],
          ['France', 6, 9],
          ['RU', 72, 3]
        ];

        chart1.options = {
          width: 1000,
          height: 700,
          chartArea: { left: 10, top: 10, bottom: 0, width: "100%" },
          colorAxis: { colors: ['#aec7e8', '#1f77b4'] },
          displayMode: 'regions'
        };

        chart1.formatters = {
          number: [{
            columnNum: 1,
            pattern: "$ #,##0.00"
          }]
        };

        this.chart = chart1;
      }
    ]
  });