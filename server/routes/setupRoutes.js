var checkAuth = require('../auth/checkAuth');
var config = require('../config');
var tweetUtils = require('../tweetProcessor/tweetUtils');
var request = require('request');
var twitterKeys = require('../auth/twitterKeys');
var Twitter = require('twitter');
var fs = require('fs');
var streamingThread = require('../tweetProcessor/streamingThread');
var AggregateFilter = require('../tweetProcessor/aggregateFilter');
var LiveFilter = require('../tweetProcessor/liveFilter');
var DevDummyFilter = require('../tweetProcessor/devDummyFilter');

module.exports = function(app) {

  // get SPA application html
  app.get('/',
    function(req, res) {
      res.sendFile(config.contentDir + '/index.html');
  });

  // api routes
  app.get(config.apiEndpointPrefix + '/live/tweets',
    function(req, res) {
      var location = req.query.location || '-180.0,-90.0,180.0,90.0';
      var limit = req.query.limit || limit;
      var filter = streamingThread.getFilter(LiveFilter.KEY);
      if (!filter) {
        streamingThread.registerFilter(LiveFilter.KEY, filter = new LiveFilter(location));
      }
      filter.reset(location, limit);
      res.json(filter.getResult());
    });    

  app.get(config.apiEndpointPrefix + '/aggregate',
    function(req, res) {
      res.json(streamingThread.getFilter(AggregateFilter.KEY).getResult());
    });

  app.get(config.apiEndpointPrefix + '/embed/tweet', // ?id=''
    function(req, res) {
      request.get({
        url: 'https://api.twitter.com/1.1/statuses/oembed.json',
        oauth: twitterKeys,
        qs: {
          id: req.query.id
        },
        json: true
      }, function(err, twitterRes, twitterResBody) {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        return res.json(twitterResBody);
      });
    });
};
