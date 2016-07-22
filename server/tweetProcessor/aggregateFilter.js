var citiesData = require('../data/citiesData');  // TODO - for this implementation we agregate data for predefined set of cities in US
var tweetUtils = require('./tweetUtils');



var AggregateFilter = function() {
  this.words = {
    'clinton' : 0,
    'trump': 0
  };
  this.result = {};
  this.total = 0;
  for(var key in citiesData){
    this.result[key] = Object.assign({}, this.words);
    this.result[key].location = citiesData[key].location;  
  };
};

AggregateFilter.KEY = 'aggregateFilter';

AggregateFilter.prototype.process = function(tweet) {
  var wordsInCity = tweetUtils.wordsInCity(tweet, this.words);
  for (var kCity in wordsInCity) {
    for (var kWord in wordsInCity[kCity]) {
      var cityResult = this.result[kCity];
      if (cityResult) 
        this.result[kCity][kWord] += 1;
        this.total += 1;
    }
  }
}

AggregateFilter.prototype.getResult = function() {
  
  return this.result; 

  // var ret = [];
  // var retOne = ["city"];
  // for(var key in this.words) {
  //   retOne.push(key);
  // }
  // ret.push(retOne);
  // for(var kResult in this.result) {
  //   retOne = [ kResult ]; // city 
  //   var cityResult = this.result[kResult];
  //   for(var key in cityResult) {
  //     retOne.push(cityResult[key]); // words count
  //   }
  // };
  
  // return ret;
}

module.exports = AggregateFilter;
