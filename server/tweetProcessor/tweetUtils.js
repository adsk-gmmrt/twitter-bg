var fs = require('fs');
var citiesData = require('../data/citiesData');

var tweetsWithWords = 0;
var tweetsWithWordsDiscarded = 0;
var tweetsWithWordsAll = 0;
var tweetsWithWordsAllDiscarded = 0;


var tweetSchema = {
    "created_at": "Wed Jul 20 10:08:38 +0000 2016",
    "id_str": "755705971243094016",
    "text": "tekst tweeta",
    "user": {
        "screen_name": "S_ALSULT3N"
    },
    "geo": {
        "type": "Point",
        "coordinates": [
            37.775,
            -122.418
        ]
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
    entities: {
        hashtags: [
            { text: 'Hillary', indices: [14, 19] }
        ]
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
        if (!this.hasCoordinates(tweet)) {
            retVal.coordinates = {
                "type": "Point",
                "coordinates": [
                    0.0,
                    0.0
                ]
            };
            if (this.hasGeo(tweet)) {
                retVal.coordinates.coordinates[0] = tweet.geo.coordinates[1];
                retVal.coordinates.coordinates[1] = tweet.geo.coordinates[0];
            } else if (this.hasPlace(tweet)) {
                var coords = tweet.place.bounding_box.coordinates[0];
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
    hasCoordinates: function(tweet) {
      var isOK = tweet.coordinates && Array.isArray(tweet.coordinates.coordinates);
      isOK = isOK && tweet.coordinates.coordinates.length == 2;
      isOK = isOK && (typeof tweet.coordinates.coordinates[0] === 'number');
      return isOK;
    },
    hasGeo: function(tweet) {
      var isOK = tweet.geo && Array.isArray(tweet.geo.coordinates);
      isOK = isOK && tweet.geo.coordinates.length == 2;
      isOK = isOK && (typeof tweet.geo.coordinates[0] === 'number');
      return isOK;       
    },
    hasPlace: function(tweet) {
      var isOK = tweet.place && tweet.place.bounding_box;
      isOK = isOK && Array.isArray(tweet.place.bounding_box.coordinates);
      isOK = isOK && Array.isArray(tweet.place.bounding_box.coordinates[0]);
      return isOK;
    },
    hasLocalization: function(tweet) {
        return this.hasCoordinates(tweet) || this.hasGeo(tweet) || this.hasPlace(tweet);
    },
 
 cityRange2: function(city){
     return 0.36;
    //  if(!city.cityRange){
    //      // A = pi*R^2
    //      // R = sqrt(A/pi)
    //      var R = Math.sqrt(city.area/Math.PI);
    //      // R in deg => R/1.852/60 => R * 0.01
    //      R *= 0.01;
    //      R = R  * R;
    //      city.cityRange = R
    //  }
    //  return city.cityRange;
 },

 cityRange2Max: function(){
     return 9.0;
 },

 wordsInCity:function(tweet, words){
  var ret = this.wordsInTweets(tweet, words);
  if(ret){
    var city =  this.tweetInCity(tweet);
    if(city && city !== ''){
        var retObj = {};
        retObj[city] = ret;
        return retObj;
    }
   }
 return undefined;
},


locationInRange: function (location, locationMin, locationMax) {
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

locationInCity: function (location, locationCity, cityRange2) {
  var dLongitude = location.longitude - locationCity.longitude;
  var dLatitude = location.latitude - locationCity.latitude;

  return (dLatitude * dLatitude + dLongitude * dLongitude < cityRange2) ? true : false;
},

locationDist2FromCity: function (location, locationCity) {
  var dLongitude = location.longitude - locationCity.longitude;
  var dLatitude = location.latitude - locationCity.latitude;

  return dLatitude * dLatitude + dLongitude * dLongitude;
},

tweetInCity: function (tweet) {
  var ret = '';
  if(tweet.place && tweet.place.place_type === "city" && 
     tweet.place.name && tweet.place.name.length>0){
    if (citiesData[tweet.place.name]) {
      tweetsWithWords += 1;
      tweetsWithWordsAll += 1;
      return citiesData[tweet.place.name].city;
    }
  }
  if (tweet.place && tweet.place.country_code === "US") {
    var tweetLocation = {
      longitude : tweet.coordinates.coordinates[0],
      latitude  : tweet.coordinates.coordinates[1]
    };
    var d2, dmin2;

    for(var city in citiesData){
      var cityObj = citiesData[city];
      d2 = this.locationDist2FromCity(tweetLocation, cityObj.location);
      if (d2 < this.cityRange2Max()) {
        if (dmin2 === undefined || dmin2 > d2) {
            dmin2 = d2;
            ret = cityObj.city;
        }
      }
    };
    tweetsWithWords += 1;
    if (ret === '')
        tweetsWithWordsDiscarded += 1;
  }
  tweetsWithWordsAll += 1;
  if (ret === '')
    tweetsWithWordsAllDiscarded += 1;
  return ret;
},
wordsInTweets:function(tweet,words){
  var isWord = false;
  var tweetText = tweet.text.toLowerCase();
  var ret = {};
  var added = false;
  if(Array.isArray(words))
  {
    for(var i=0; i < words.length; i++ )
    {
        isWord = tweetText.indexOf(words[i]) >= 0;
        if(isWord){
            ret[words[i]]= isWord;
            added = true;
        }
    }
    if (added) 
      return ret; 
  } else if(typeof words === 'object'){
    for(var k in words){
        isWord = tweetText.indexOf(k) >= 0;
        if(isWord){
            ret[k]= isWord;
            added = true;
        }
    }
    if (added) 
      return ret; 
  } else if (typeof words === 'string'){
    isWord = tweetText.indexOf(words) >= 0;
    if(isWord){
        return({ words: isWord });
    }
  }
  return undefined;
},

};
