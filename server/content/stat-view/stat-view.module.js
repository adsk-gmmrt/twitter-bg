'use strict';

angular.module('twigbro.statView', [
  'googlechart'
])

  .factory('StatService', function () {

    var getData = function () {
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

      var output = [
        ['City', 'Population', 'Area']
      ];

      for (var i = 0; i < cities.length; i++) {
        output.push([cities[i], Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 1000) + 1)]);
      }

      return output;
    }

    return {
      getData: getData
    }

  });