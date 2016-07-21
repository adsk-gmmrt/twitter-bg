'use strict';

angular.module('twigbro.statView')
  .factory('StatService', function () {

    var cities = [
      "Montgomery",
      "Juneau",
      "Phoenix",
      "Little Rock",
      "Sacramento",
      "Denver",
      "Hartford",
      "Dover",
      "Tallahassee",
      "Atlanta",
      "Honolulu",
      "Boise",
      "Springfield",
      "Indianapolis",
      "Des Moines",
      "Topeka",
      "Frankfort",
      "Baton Rouge",
      "Augusta",
      "Annapolis",
      "Boston",
      "Lansing",
      "St. Paul",
      "Jackson",
      "Jefferson City",
      "Helena",
      "Lincoln",
      "Carson City",
      "Concord",
      "Trenton",
      "Santa Fe",
      "Albany",
      "Raleigh",
      "Bismarck",
      "Columbus",
      "Oklahoma City",
      "Salem",
      "Harrisburg",
      "Providence",
      "Columbia",
      "Pierre",
      "Nashville",
      "Austin",
      "Salt Lake City",
      "Montpelier",
      "Richmond",
      "Olympia",
      "Charleston",
      "Madison",
      "Cheyenne"
    ]

    var data = [];

    for (var i = Math.floor(Math.random() * 10 + 1); i < cities.length; i += 5) {
      var totalVotes = Math.floor((Math.random() * 1000000) + 1);
      var clinton = Math.random();
      data.push([cities[i], clinton * totalVotes, (1 - clinton) * totalVotes]);
    }

    var getVotes = function (name) {

      var output = [
        [
          'City',
          name === "CLINTON" ? 'Votes for Clinton' : 'Votes for Trump',
          'Total votes'
        ]
      ]

      for (var i = 0; i < data.length; i++) {
        var total = data[i][1] + data[i][2];
        if (total > 0) {
          output.push([data[i][0], data[i][name === "CLINTON" ? 1 : 2] / total, total])
        }
      }

      return output;
    }

    return {
      getVotes: getVotes,
    }

  });