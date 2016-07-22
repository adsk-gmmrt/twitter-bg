var config = require('../config');
var tweetUtils = require('../tweetProcessor/tweetUtils');
var twitterKeys = require('../auth/twitterKeys');
var Twitter = require('twitter');

var StreamingThread = function(locations) {
  this.locations = locations || '-180.0,-90.0,180.0,90.0'; // NY'-74.0,40.0,-73.0,41.0'; 
  this.seenTweets = 0;  
  this.client = new Twitter(twitterKeys);
  this.filters = {};
  this.filterKeys = [];
  this.createStream(); 
  this.totalTweetCount = 0;
  this.startTime = Date.now();
  this.lostTweets = 0;
  setInterval(this.logStatistic.bind(this), 20000);
};
StreamingThread.prototype.logStatistic = function(){
  var time = (Date.now() - this.startTime)/1000;
  var t2sek = parseInt(this.totalTweetCount/time);
  var l2c = parseInt((this.seenTweets/this.totalTweetCount)*100);
  console.log("After "+ time +' [sek] was ' + this.totalTweetCount +' tweets ( '+ t2sek + ' tweet/[sek] ) and ' + l2c + ' [%] with localization.' );
  if(this.lostTweets>0)
    console.log('We lost ' + this.lostTweets +' tweets');
}

StreamingThread.prototype.createStream = function() {
  this.stream = this.client.stream('statuses/filter', {locations: this.locations});
  this.stream.on('data', this.onTweet.bind(this));
  this.stream.on('error', this.onStreamError.bind(this));

  return this.stream;
};

StreamingThread.prototype.onTweet = function(tweet) {
  if (this.isValidTweet(tweet)) {
    this.seenTweets++;
    this.totalTweetCount++;
    var tweetExtract = tweetUtils.filterTweetFields(tweet);
    if (tweetExtract) {
      for (var i = 0; i < this.filterKeys.length; i++) {
        this.filters[this.filterKeys[i]].process(tweetExtract);
      }
    }
  }
  else{
    if(tweet.limit){
      this.lostTweets = tweet.limit.track;
    }
    else{
      this.totalTweetCount ++;
      console.log('tweet ', JSON.stringify(tweet));
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
  var isOK = (!!tweet.created_at) && (!!tweet.text) && (!!tweet.id_str);
  isOK = isOK && tweetUtils.hasLocalization(tweet);
  return isOK;
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

module.exports = new StreamingThread('-125.0,20.0,-67.0,45.0');
