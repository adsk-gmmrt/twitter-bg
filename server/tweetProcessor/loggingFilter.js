var tweetUtils = require('./tweetUtils');

var LoggingFilter = function() {
};

LoggingFilter.KEY = 'loggingFilter';

LoggingFilter.prototype.process = function(tweet) {
  console.log("New tweet: " + tweet.text);
};

LoggingFilter.prototype.getResult = function() {
};

module.exports = LoggingFilter;
