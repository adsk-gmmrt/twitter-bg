var tweetUtils = require('./tweetUtils');

var LiveFilter = function(coordinates, words, limit) {
    this.limit = limit || 100;
    this.count = 0;
    this.coordinates = coordinates;
    this.tweets = {};
    this.words = words;
    this.wordsAreSet = (words && Array.isArray(words) && words.length > 0);
};

LiveFilter.prototype.process = function(tweet) {
    var isOk = !!tweet.created_at;
    if(isOk && this.wordsAreSet){
        isOk = !!tweetUtils.wordsInTweets(tweet , this.words);
    }
    if(isOk){
       var tweetLocation = tweet.coordinates.coordinates;
       isOk = tweetUtils.locationInRange(tweetLocation, this.coordinates);
    }
    if(isOk){
      this.tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweet;
      if (this.count < limit) {
        this.count++;
      } else {
        delete this.tweets[Object.keys(this.tweets)[0]];
      }
    }
}

LiveFilter.prototype.getResult = function() {
    return this.tweets;
}

module.exports = LiveFilter;
