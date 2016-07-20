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
    /*statisticTwoWord: {},
    statisticTwoWord.prototype.initializeObject= function(){
        for(var city in citiesData){
            statObject[city] = [0,0];
        }
    }*/

  statisticTwoWordAnalize : function(tweets, words){
  if(!Array.isArray(words) || words.length != 2)
  {
    console.log('Invalid words for 2D statistic')
    return;
  }
   for(var i=0; i < tweets.length; i++)
   {
     wordsInCity = wordsInCity(tweets[i],words);
     for(var i=0; i < 2; i++ ){
       if(wordsInCity[i].length>0){
         statObject[wordsInCity[i]][i] = statObject[wordsInCity[i]][i] + 1;
       }
     }
   }
 },

 wordsInCity:function(tweet, words){
  var ret = wordsInTweets(tweet, words);
  var city =  tweetInCity(tweet);
  if(Array.isArray(ret))
  {
    for (var i = 0; i < ret.length; i++) {
      ret[i] = ret[i] ? city : ret;
    }
  }
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
        break;
      };
    };
  }
},
wordsInTweets:function(tweet,words){
  if(Array.isArray(words))
  {
    var ret = [];
    for(var i=0; i < words.length; i++ )
    {
      ret.push( tweet.text.indexOf(words[i])<0 );
    }
  } 
  else{
    return( tweet.text.indexOf(words)<0 );
  }
}

};
