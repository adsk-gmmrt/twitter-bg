var tweetUtils = require('./tweetUtils');

var LoggingFilter = function() {
};

LoggingFilter.KEY = 'loggingFilter';

LoggingFilter.prototype.process = function(tweet) {
  console.log("New tweet: ");
  console.log("Text:",tweet.text);
  console.log("Coordinates: ", tweet.coordinates.coordinates);
  if(tweet.place && tweet.place_type == "city" && tweet.place.name){
    console.log("City: ", tweet.place.name);
  } else{
    console.log("City is not defined");
  }
};

LoggingFilter.prototype.getResult = function() {
};

module.exports = LoggingFilter;
