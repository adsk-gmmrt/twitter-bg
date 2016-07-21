var tweetUtils = require('./tweetUtils');

var LiveFilter = function (coordinates, limit) {
    this.reset(coordinates, limit);
};

LiveFilter.KEY = 'liveFilter';

LiveFilter.prototype.reset = function (coordinates, limit) {
    this.limit = limit || 100;
    if (this.setCoordinates(coordinates)) {
        this.count = 0;    
        this.tweets = {};
    }
};

LiveFilter.prototype.setLimit = function (limit) {
    this.limit = limit;
    this.checkSize();
};

LiveFilter.prototype.checkSize = function () {
    if (this.count > this.limit) {
        for (var k in this.tweets) {
            delete this.tweets[k];
            this.count--;
            if (this.count <= this.limit) {
                break;
            }
        }
    }
};

LiveFilter.prototype.setCoordinates = function (coordinates) {
    if (typeof coordinates === 'string') {
        if (this.lastStringCoordinates === coordinates) {
            return false;
        }
        var coordsArray = coordinates.split(',');
        this.coordinates = {
            min: { longitude: parseFloat(coordsArray[0]), latitude: parseFloat(coordsArray[1]) },
            max: { longitude: parseFloat(coordsArray[2]), latitude: parseFloat(coordsArray[3]) }
        };
        this.lastStringCoordinates = coordinates;
    } else {
        this.coordinates = {
            min: { longitude: coordinates[3][0], latitude: coordinates[3][1] },
            max: { longitude: coordinates[1][0], latitude: coordinates[1][1] }
        };
    }
    return true;
};

LiveFilter.prototype.addTweet = function (tweet) {
    this.tweets[(new Date(tweet.created_at)).toISOString() + tweet.id_str] = tweet;
    this.count++;
    this.checkSize();
}

LiveFilter.prototype.process = function (tweet) {
    var tweetLocation = {
        longitude: tweet.coordinates.coordinates[0],
        latitude: tweet.coordinates.coordinates[1]
    };
    if (tweetUtils.locationInRange(tweetLocation, this.coordinates.min, this.coordinates.max)) {
        this.addTweet(tweet);
    }
};

LiveFilter.prototype.getResult = function () {
    return this.tweets;
}

module.exports = LiveFilter;
