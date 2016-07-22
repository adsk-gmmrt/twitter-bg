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
            self.chart.data = result.data;
            self.cities = result.cities;
          });
        }

        this.getTotal = function (index) {
          return this.chart.data[index][3];
        }

        this.getVotes = function (index, name) {
          if (name === 'clinton') {
            return (this.chart.data[index][2] * this.chart.data[index][3]).toFixed();
          } else if (name === 'trump') {
            return ((1 - this.chart.data[index][2]) * this.chart.data[index][3]).toFixed();
          }
        }

        this.getPercent = function (index, name) {
          if (name === 'clinton') {
            return (this.chart.data[index][2] * 100).toFixed(1);
          } else if (name === 'trump') {
            return ((1 - this.chart.data[index][2]) * 100).toFixed(1);
          }
        }

        this.chart = StatService.createChart();
        this.cities = [];
        this.loadData();

      }
    ]
  });