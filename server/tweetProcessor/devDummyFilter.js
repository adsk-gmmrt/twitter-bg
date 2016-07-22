var tweetUtils = require('./tweetUtils');
var fs = require('fs');

var DevDummyFilter = function(limit) {
    this.limit = limit || 100;
    this.count = 0;
    this.writes = 0;
    this.tweets = {};
};

DevDummyFilter.KEY = 'devDummy';

DevDummyFilter.prototype.process = function(tweet) {
  this.tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweet;
  this.count++;
  if (this.count >= this.limit) {
    var that = this;
     fs.writeFile(__dirname + '/tweets-' + (("000000"+this.writes).slice(-7)) + '.json', JSON.stringify(this.tweets), function (err,data) {
      that.writes++;
      that.tweets = {};
      that.count = 0;
    });
  }
}

DevDummyFilter.prototype.getResult = function() {
}

module.exports = DevDummyFilter;
