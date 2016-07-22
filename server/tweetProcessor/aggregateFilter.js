var citiesData = require('../data/citiesData');  // TODO - for this implementation we agregate data for predefined set of cities in US
var tweetUtils = require('./tweetUtils');
var fs = require('fs');
var filename = "./server/data/agregateFilter.json"


var AggregateFilter = function() {
  this.words = {
    'a' : 0,
    'b': 0
  };
  this.result = {};
  this.total = 0;
  this.result = {};
  for(var key in citiesData){
    this.result[key] = Object.assign({}, this.words);
    this.result[key].location = citiesData[key].location;  
  };
  this.deserialize();
  this.count = 0;
  setInterval(this.log.bind(this), 30000);
};
AggregateFilter.prototype.serialize = function(){
   fs.writeFile(filename, JSON.stringify(this.result), 'utf8', function (err) {
     if (err) {
       return console.log(err);
     }
     else{
       return console.log('Result serialized successful');
     }
   });
}
AggregateFilter.prototype.deserialize = function(){
    try{
      var fromFile = fs.readFileSync(filename, 'utf8');
      var serializedResults = JSON.parse(fromFile);
      var dataOK = true;
      for(var ks in serializedResults)
      {
        for(var kw in this.words)
        {
          dataOK = dataOK && serializedResults[ks][kw] != undefined;
        }
        break;
      }
      if(dataOK)
      {
        for(var kr in this.result)
        {
          for(var kw in this.words)
          {
            if(!!serializedResults[kr])
            {
              this.result[kr][kw] = serializedResults[kr][kw];
            }
          }
        }        
      }
      else{
        return console.log('Diffrent words in serialized data and in the filter');
      }
    } catch(err){      
      return console.log(err);
    }
}
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
  this.serialize();
}

AggregateFilter.KEY = 'aggregateFilter';

AggregateFilter.prototype.process = function(tweet) {
  var wordsInCity = tweetUtils.wordsInCity(tweet, this.words);
  for (var kCity in wordsInCity) {
    for (var kWord in wordsInCity[kCity]) {
      var cityResult = this.result[kCity];
      if (cityResult) 
        this.result[kCity][kWord] += 1;
        this.count += 1;
    }
  }
}

AggregateFilter.prototype.getResult = function() {
  
  return this.result; 
}

module.exports = AggregateFilter;
