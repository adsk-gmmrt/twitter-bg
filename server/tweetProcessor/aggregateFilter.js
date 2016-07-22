var citiesData = require('../data/citiesData');  // TODO - for this implementation we agregate data for predefined set of cities in US
var tweetUtils = require('./tweetUtils');
var fs = require('fs');
var filename = "./server/data/agregateFilter.txt"



var AggregateFilter = function() {
  this.words = {
    'clinton' : 0,
    'trump': 0
  };
  this.result = {};
  this.total = 0;
  try{
    this.result = JSON.parse(fs.readFileSync(filename, 'utf8'));
  }
  catch(err)
  {
    this.result = {};
  };
  for(var key in citiesData){
    this.result[key] = Object.assign({}, this.words);
    this.result[key].location = citiesData[key].location;  
  };
  this.count = 0;
  setInterval(this.log.bind(this), 30000);
};
AggregateFilter.prototype.log= function() {
  var trump = 0;
  var clinton=0;
  console.log('AggregateFilter analized ',this.count, ' tweets.')
  for(var k in this.result){
    if(this.result[k].clinton > 0 || this.result[k].trump > 0){
      trump +=this.result[k].trump;
      clinton += this.result[k].clinton;
      console.log(k,' : Trump-',this.result[k].trump, ', Clinton-',this.result[k].clinton)
    }
  }
  console.log('Found ',trump+clinton, ' words ',trump, '-Trump ', clinton, '-Clinton.' )
  fs.writeFile(filename, JSON.stringify(this.result), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

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
