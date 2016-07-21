var tweetUtils = require('./tweetUtils');

var LiveFilter = function(coordinates, words, limit) {
    this.limit = limit || 100;
    this.count = 0;
    this.coordinates = {
      min : {longitude:coordinates[3][0], latitude:coordinates[3][1]},
      max : {longitude:coordinates[1][0], latitude:coordinates[1][1]}
    };
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
      var tweetLocation = {
        longitude : tweet.coordinates.coordinates[0],
        latitude  : tweet.coordinates.coordinates[1]
      };
      isOk = tweetUtils.locationInRange(tweetLocation, this.coordinates.min, this.coordinates.max );
    }
    if(isOk){
      this.tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweet;
      if (this.count < this.limit) {
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
