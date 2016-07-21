var tweetUtils = require('./tweetUtils');

var LoggingFilter = function() {
};

LoggingFilter.KEY = 'loggingFilter';

LoggingFilter.prototype.process = function(tweet) {
  console.log("New tweet: " + tweet.text);
  if (tweet.place)
    console.log(" ---- City: " + tweet.place.name);
  else
    console.log(" No place!!!!!");
  console.log(" ---- Location: " + retVal.coordinates.coordinates); 
};

LoggingFilter.prototype.getResult = function() {
};

module.exports = LoggingFilter;
