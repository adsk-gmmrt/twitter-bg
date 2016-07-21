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

    for (var i = Math.floor(Math.random() * 10 + 1); i < cities.length; i += 10) {
      var totalVotes = Math.floor((Math.random() * 1000000) + 1);
      var clinton = Math.random();
      data.push([cities[i], clinton * totalVotes, (1 - clinton) * totalVotes]);
    }

    var getVotes = function (name) {

      var validName = name[0].toUpperCase() + name.slice(1);

      var votesIdx = 0;
      var votesHeader = 'Votes for ' + validName;

      if (validName === 'Clinton') {
        votesIdx = 1;
      } else if (validName === 'Trump') {
        votesIdx = 2;
      }

      var output = [
        [
          'City',
          votesHeader,
          'Total votes'
        ]
      ]

      if (votesIdx > 0) {
        for (var i = 0; i < data.length; i++) {
          var total = data[i][1] + data[i][2];
          if (total > 0) {
            output.push([data[i][0], data[i][votesIdx] / total, total])
          }
        }
      }

      return output;
    }

    return {
      getVotes: getVotes,
    }

  });