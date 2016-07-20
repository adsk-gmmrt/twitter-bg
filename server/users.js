// a primitive user persistence - does not make any sense, butjust because it was listed in requiremets
var fs = require('fs');

module.exports = function() {
  this.users = [];

  var that = this;

  fs.readFile(__dirname + '/users.json', 'utf8', function (err, data) {
    if (err) throw err;
    that.users = JSON.parse(data);
  });

  this.findOrCreateUser = function(userProfile, callback) {
    for(var i = 0; i < this.users.length; i++) {
      if (this.users[i].username === userProfile.username)
        return callback(null, this.users[i]);
    }
    this.users.push(userProfile);
    fs.writeFile(__dirname + '/users.json', JSON.stringify(this.users), function (err,data) {
      if (err) {
        console.log(err);
        return callback(err);
      }
      callback(null, userProfile);
    });
  };
};