var config = require('../config');
var tweetUtils = require('../tweetProcessor/tweetUtils');
var twitterKeys = require('../auth/twitterKeys');
var Twitter = require('twitter');

var StreamingThread = function(locations) {
  this.locations = locations || '-180.0,-90.0,180.0,90.0';
  this.seenTweets = 0;  
  this.client = new Twitter(twitterKeys);
  this.filters = {};
  this.filterKeys = [];
  this.createStream(); 
};

StreamingThread.prototype.createStream = function() {
  this.stream = this.client.stream('statuses/filter', {locations: this.locations});
  this.stream.on('data', this.onTweet.bind(this));
  this.stream.on('error', this.onStreamError.bind(this));

  return this.stream;
};

StreamingThread.prototype.onTweet = function(tweet) {
  if (this.isValidTweet(tweet)) {
    this.seenTweets++;
    var tweetExtract = tweetUtils.filterTweetFields(tweet);
    for (var i = 0; i < this.filterKeys.length; i++) {
      this.filters[this.filterKeys[i]].process(tweetExtract);
    }
  }
};

StreamingThread.prototype.onStreamError = function(error) {
  console.log('Connection to twitter stream experienced troubles: ', error);
  console.log('Reconnecting...');
  console.log(error);
  throw new Error(error);
  //this.createStream(); 
};

StreamingThread.prototype.isValidTweet = function(tweet) {
   return (!!tweet.created_at) && (!!tweet.text) && (!!tweet.id);
};

StreamingThread.prototype.registerFilter = function(filterKey, filter) {
  this.filters[filterKey] = filter;
  this.filterKeys = Object.keys(this.filters);
};

StreamingThread.prototype.deregisterFilter = function(filterKey) {
  if (filterKey in this.filters) {
    delete this.filters[filterKey];
    this.filterKeys = Object.keys(this.filters);
  }
};

StreamingThread.prototype.getFilter = function(filterKey) {
  return this.filters[filterKey];
};

module.exports = new StreamingThread();
