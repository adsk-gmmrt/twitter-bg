'use strict';

angular.
  module('twigbro.statView').
  component('statView', {
    templateUrl: 'stat-view/stat-view.template.html',
    controller: [

      function StatViewController($scope) {

        // var chart1 = {};
        // chart1.type = "ColumnChart";
        // chart1.cssStyle = "width: 900px; height: 500px;";
        // chart1.data = {
        //   "cols": [
        //     { id: "month", label: "Month", type: "string" },
        //     { id: "laptop-id", label: "Laptop", type: "number" },
        //     { id: "desktop-id", label: "Desktop", type: "number" },
        //     { id: "server-id", label: "Server", type: "number" },
        //     { id: "cost-id", label: "Shipping", type: "number" }
        //   ], "rows": [
        //     {
        //       c: [
        //         { v: "January" },
        //         { v: 19, f: "42 items" },
        //         { v: 12, f: "Ony 12 items" },
        //         { v: 7, f: "7 servers" },
        //         { v: 4 }
        //       ]
        //     },
        //     {
        //       c: [
        //         { v: "February" },
        //         { v: 13 },
        //         { v: 1, f: "1 unit (Out of stock this month)" },
        //         { v: 12 },
        //         { v: 2 }
        //       ]
        //     },
        //     {
        //       c: [
        //         { v: "March" },
        //         { v: 24 },
        //         { v: 0 },
        //         { v: 11 },
        //         { v: 6 }

        //       ]
        //     }
        //   ]
        // };

        // chart1.options = {
        //   "title": "Sales per month",
        //   "isStacked": "true",
        //   "fill": 20,
        //   "displayExactValues": true,
        //   "vAxis": {
        //     "title": "Sales unit", "gridlines": { "count": 6 }
        //   },
        //   "hAxis": {
        //     "title": "Date"
        //   }
        // };

        // chart1.formatters = {};

        var chart1 = {};
        chart1.type = "GeoChart";
        chart1.cssStyle = "width: 1200px; height: 800px;";
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
          chartArea: { left: 10, top: 10, bottom: 0, height: "100%" },
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