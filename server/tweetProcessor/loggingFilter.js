var tweetUtils = require('./tweetUtils');

var LoggingFilter = function() {
};

LoggingFilter.KEY = 'loggingFilter';

LoggingFilter.prototype.process = function(tweet) {
  // console.log("New tweet: ",tweet.text);
  // if(tweet.place && tweet.place.place_type == "city" && tweet.place.name){
  //   console.log("City: ", tweet.place.name, "Coordinates: ", tweet.coordinates.coordinates);
  // } else{
  //   console.log("Coordinates: ", tweet.coordinates.coordinates);
  //   console.log("City is not defined");
  // }
};

LoggingFilter.prototype.getResult = function() {
};

module.exports = LoggingFilter;
