'use strict';

angular.
  module('twigbro.statView').
  component('statView', {
    templateUrl: 'stat-view/stat-view.template.html',
    controller: ['StatService',

      function StatViewController(StatService) {

        this.loadData = function () {
          var self = this;
          StatService.getVotes().then(function (result) {
            self.chart.data = result["data"];
          });
        }

        this.chart = StatService.createChart();
        this.loadData();

      }
    ]
  });