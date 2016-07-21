var tweetUtils = require('./tweetUtils');

var DevDummyFilter = function(limit) {
    this.limit = limit || 100;
    this.count = 0;
    this.tweets = {};
};

DevDummyFilter.KEY = 'devDummy';

DevDummyFilter.prototype.process = function(tweet) {
  this.tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweet;
  if (this.count < this.limit) {
    this.count++;
  } else {
    delete this.tweets[Object.keys(this.tweets)[0]];
  }
}

DevDummyFilter.prototype.getResult = function() {
    return this.tweets;
}

module.exports = DevDummyFilter;
