var tweetUtils = require('./tweetUtils');

var LiveFilter = function(coordinates, words) {
    this.coordinates = coordinates;
    this.tweets = {};
    this.words = words;
    this.wordsAreSet = (words && Array.isArray(words) && words.length > 0);
};

LiveFilter.prototype.process = function(tweet) {
    var isOk = !!tweet.created_at;
    if(isOk && wordsAreSet){
        isOk = !!tweetUtils.wordsInTweets(tweet , words);
    }
    if(isOk){
       var tweetLocation = tweet.coordinates.coordinates;
       isOk = tweetUtils.locationInRange(tweetLocation,coordinates);
    }
    if(isOk){
      tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweetUtils.filterTweetFields(tweet);
    }
}

LiveFilter.prototype.getResult = function() {
    return this.tweets;
}

module.exports = LiveFilter;
