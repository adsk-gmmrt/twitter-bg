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
  var ret = wordsInTweets(tweet, words);
  if(ret){
    var city =  tweetInCity(tweet);
    if(city){
        return { city : ret};
    }
   }
 return undefined;
},

locationInRange:function (location, locationBox) {
  //  2 ___ 1
  //  |     |
  //  3 ___ 0
  if (location[1] >= locationMin[3][1])
    if (location[1] <= locationMax[1][1])
      if (location[0] >= locationBox[3][0])
        if (location[0] <= locationMax[1][0])
          return true;
  return false;
},
 
locationInCity: function (location, locationCity) {
  var dLongitude = location[0] - locationCity.longitude;
  var dLatitude = location[1] - locationCity.latitude;

  return (dLatitude * dLatitude + dLongitude * dLongitude < cityRange2) ? true : false;
},


tweetInCity: function (tweet) {
  var ret = '';
  if(tweet.place && tweet.place.place_type === "city" && 
     tweet.place.name && tweet.place.name.length>0){
    return !!citiesData[name];
  }else{
    var tweetLocation =[];
    tweetLocation = tweet.coordinates.coordinates;
    for(var city in citiesData){
      if (locationInCity (tweetLocation, citiesData[city])){
        ret = citiesData[city].city;
        return ret;
      };
    };
  }
  return ret;
},
wordsInTweets:function(orgTweet,words){
  var isWord = false;
  tweet = isWord.toLowerCase();
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
  } 
  else{
    isWord = tweet.text.indexOf(words) < 0;
    if(isWord){
        return({ words: isWord });
    }
  }
  return undefined;
}

};
