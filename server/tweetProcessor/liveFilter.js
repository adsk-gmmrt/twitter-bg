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
      this.count++;
      if (this.count > this.limit){
      	for(var k in this.tweets){
            delete this.tweets[k];
            this.count--;
            if(this.count < this.limit){
                break;
            }
        }
      }
   }
}

LiveFilter.prototype.getResult = function() {
    return this.tweets;
}
LiveFilter.prototype.setLimit= function(limit){
    this.limit = limit;
}

module.exports = LiveFilter;
