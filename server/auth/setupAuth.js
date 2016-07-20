var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var twitterKeys = require('./twitterKeys');
var config = require('../config');
var users = new (require('../users'))();


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: twitterKeys.consumer_key,
    consumerSecret: twitterKeys.consumer_secret,
    callbackURL: "http://twig-bro.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, callback) {
    users.findOrCreateUser(profile, function(err, foundProfile) {
      if (err) {
        return callback(err);
      }
      return callback(null, {
        profile: foundProfile,
        oauth: Object.assign({}, twitterKeys, {token: token, token_secret: tokenSecret})
      });
    });
    // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    // return callback(null, {
    //   profile: profile,
    //   oauth: Object.assign({}, twitterKeys, {token: token, token_secret: tokenSecret})
    // });
  }
));


module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      console.dir(req.user);
      res.redirect('/');
  });

  app.get('/signin', function(req, res) {
    if (req.isAuthenticated())
      res.redirect('/');
    else
      res.sendFile(config.contentDir + '/signin.html');
  });

  app.get('/isSignedIn', function(req, res) {
    res.json({
      isSignedIn: req.isAuthenticated()
    });
  });

  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};
