var express = require('express');
var session = require('express-session');
var config = require('./config');

//// 
//// Uncomment following line to start readint stream of tweets
////
console.log(require('./tweetProcessor/setupStreamingThread')());

var app = new express();

app.use(session({
  secret: 'The biggest secret you can imagine',
  resave: false,
  saveUninitialized: true,
  name: 'twigbro.s'
}));

require('./auth/setupAuth')(app);
require('./routes/setupRoutes')(app);

app.use(express.static(config.contentDir));

app.listen(process.env.PORT || 80);
