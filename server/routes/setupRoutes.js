var checkAuth = require('../auth/checkAuth');
var config = require('../config');
var request = require('request');
var twitterKeys = require('../auth/twitterKeys');

module.exports = function(app) {

  // get SPA application html
  app.get('/', checkAuth,
    function(req, res) {
      res.sendFile(config.contentDir + '/index.html');
  });

  // api routes
  app.get(config.apiEndpointPrefix + '/userprofile', checkAuth,
    function(req, res) {
      res.json(req.user.profile);
    });

  app.get(config.apiEndpointPrefix + '/usertweets', checkAuth,
    function(req, res) {
      request.get({
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
        oauth: req.user.oauth,
        qs: {
          screen_name: req.user.profile.username
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

  app.get(config.apiEndpointPrefix + '/userfollows', checkAuth,
    function(req, res) {
      res.json('@TODO');
    });
};