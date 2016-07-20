var checkAuth = require('../auth/checkAuth');
var config = require('../config');
var tweetUtils = require('../tweetProcessor/tweetUtils');
var request = require('request');
var twitterKeys = require('../auth/twitterKeys');
var Twitter = require('twitter');
var fs = require('fs');

module.exports = function(app) {

  // get SPA application html
  app.get('/',
    function(req, res) {
      res.sendFile(config.contentDir + '/index.html');
  });

  // api routes
  app.get(config.apiEndpointPrefix + '/live/tweets',
    function(req, res) {
      res.json(tweetUtils.tweetsStub(req.query.limit || 100));
    });

  app.get(config.apiEndpointPrefix + '/streamtweets',
  function(req, res) {
    var tweets = {};
    var client = new Twitter(twitterKeys);
    var stream = client.stream('statuses/filter', {locations: '-180.0,0.0,0.0,90.0'});
    var bWrite = true;
    stream.on('data', function(tweet) {
      if (!tweet.created_at)
        return;
      tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweetUtils.filterTweetFields(tweet);
      console.log(Object.keys(tweets).length);
      //console.log(tweet);
      if (Object.keys(tweets).length >= 1000) {
        if (bWrite){
        fs.writeFile(__dirname + '/stream.json', JSON.stringify(tweets), function (err,data) {
          if (err) {
            console.log(err);
          }
        });
      }
      bWrite = false;          
      }
    });
    stream.on('error', function(error) {
      throw error;
    });
    stream = null;
  });
};