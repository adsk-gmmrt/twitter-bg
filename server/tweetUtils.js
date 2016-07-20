var fs = require('fs');

var tweetSchema = {
    "created_at": "Wed Jul 20 10:08:38 +0000 2016",
    "id_str": "755705971243094016",
    "text": "tekst tweeta",
    "user": {
        "screen_name": "S_ALSULT3N"
    },
    "coordinates": {
        "type": "Point",
        "coordinates": [
            -122.418,
            37.775
        ]
    },
    "place": {
        "place_type": "city",
        "name": "San Francisco",
        "full_name": "San Francisco, CA",
        "country_code": "US",
        "country": "United States",
        "bounding_box": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -122.514926,
                        37.708075
                    ],
                    [
                        -122.514926,
                        37.833238
                    ],
                    [
                        -122.357031,
                        37.833238
                    ],
                    [
                        -122.357031,
                        37.708075
                    ]
                ]
            ]
        }
    },
    "lang": "ar"
};

var sampleTweets = JSON.parse(fs.readFileSync(__dirname + '/data/stream.json', 'utf8'));

var filterObjectFields = function(obj, pattern) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    var retVal = {};
    for (var key in pattern) {
        var keyVal = obj[key];
        if (!Array.isArray(keyVal) && typeof keyVal == 'object') {
            retVal[key] = filterObjectFields(keyVal, pattern[key]);
        } else {
            retVal[key] = obj[key];
        }
    }
    return retVal;
};

module.exports = {
    filterTweetFields: function(tweet) {
        var retVal = filterObjectFields(tweet, tweetSchema);
        if (!tweet.coordinates) {
            retVal.coordinates = {
                "type": "Point",
                "coordinates": [
                    0.0,
                    0.0
                ]
            };
            if (tweet.geo) {
                //@@TODO read from geo
            } else if (tweet.place && tweet.place.bounding_box) {
                var coords = tweet.place.bounding_box.coordinates;
                for (var i = 0; i < coords.length; i++) {
                    retVal.coordinates.coordinates[0] += coords[i][0];
                    retVal.coordinates.coordinates[1] += coords[i][1];
                }
                retVal.coordinates.coordinates[0] /= coords.length;
                retVal.coordinates.coordinates[1] /= coords.length;
            }
        }
        return retVal;
    },
    tweetsStub: function(count) {
        return sampleTweets.slice(0, Math.min(count, sampleTweets.length));
    }
};
