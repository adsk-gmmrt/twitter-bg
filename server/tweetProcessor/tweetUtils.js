var fs = require('fs');
var citiesData = require('../data/citiesData');

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

var sampleTweets = JSON.parse(fs.readFileSync(__dirname + '/../data/stream.json', 'utf8'));

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
        return sampleTweets;
    },
    cityRange2: 0.36,

 wordsInCity:function(tweet, words){
  var ret = this.wordsInTweets(tweet, words);
  if(ret){
    var city =  this.tweetInCity(tweet);
    if(city){
        return { city : ret};
    }
   }
 return undefined;
},


locationInRange = function (location, locationMin, locationMax) {
  //            _____locationMax
  //           |     |
  //locationMin|_____|
  if (location.latitude >= locationMin.latitude)
    if (location.latitude <= locationMax.latitude)
      if (location.longitude >= locationMin.longitude)
        if (location.longitude <= locationMax.longitude)
          return true;
  return false;
},

locationInCity: function (location, locationCity) {
  var dLongitude = location.longitude - locationCity.longitude;
  var dLatitude = location.latitude - locationCity.latitude;

  return (dLatitude * dLatitude + dLongitude * dLongitude < this.cityRange2) ? true : false;
},


tweetInCity: function (tweet) {
  var ret = '';
  if(tweet.place && tweet.place.place_type === "city" && 
     tweet.place.name && tweet.place.name.length>0){
    return !!citiesData[tweet.place.name];
  }else{
    var tweetLocation = {
      longitude : tweet.coordinates.coordinates[0],
      latitude  : tweet.coordinates.coordinates[1]
    };
    for(var city in citiesData){
      if (this.locationInCity (tweetLocation, citiesData[city])){
        ret = citiesData[city].city;
        return ret;
      };
    };
  }
  return ret;
},
wordsInTweets:function(orgTweet,words){
  var isWord = false;
  tweet = orgTweet.toLowerCase();
  if(Array.isArray(words))
  {
    var ret = {};
    for(var i=0; i < words.length; i++ )
    {
        isWord = tweet.text.indexOf(words[i]) < 0;
        if(isWord){
            ret[words[i]]= isWord;
        }
    }
    return ret; 
  } else if(typeof words === 'object'){
    for(var k in words){
        isWord = tweet.text.indexOf(words[k]) < 0;
        if(isWord){
            ret[words[k]]= isWord;
        }
    }
    return ret;
  } else if (typeof words === 'string'){
    isWord = tweet.text.indexOf(words) < 0;
    if(isWord){
        return({ words: isWord });
    }
  }
  return undefined;
},

};
