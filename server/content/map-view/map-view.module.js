'use strict';

angular.module('twigbro.mapView', ['ngtweet'])
.factory('MapViewState', function($window, $http){
	//-------------------------------------------
    // Configuration
	var markerBufferSize = 300;         // max number of displayed tweets
	var readTweetsLimit = 50;          // one GET request limit
	var readTweetsInterval = 1000;      // miliseconds
    var checkTweetsAgeInterval = 2000;  // miliseconds

    var ageArr = [2,4,6,12,20,30,40,50,60];  // in seconds (<10) age === 1, (<20)age === 2 etc.
    //--------------------------------------------


	var tweets = {}; // main tweets container
    var mapProp = {
      center : new google.maps.LatLng(50.1055, 19.8433),
      zoom : 5,
      mapTypeId : google.maps.MapTypeId.ROADMAP,
    };


	// delete num first attributtes
	var deleteOldestTweets = function(num){
		var keyArr =  Object.keys(tweets);
		for(var i = 0; i < num; i++){
			var tweet = tweets[keyArr[i]];
			if( tweet.marker){
				tweet.marker.setMap(null);
			}
			delete tweets[keyArr[i]];
		}
	}

	var readTweets = function(){
		var lngMin = Math.min(mapProp.mapBounds.b.b, mapProp.mapBounds.b.f);
		var lngMax = Math.max(mapProp.mapBounds.b.b, mapProp.mapBounds.b.f);
		var latMin = Math.min(mapProp.mapBounds.f.b, mapProp.mapBounds.f.f);
		var latMax = Math.max(mapProp.mapBounds.f.b, mapProp.mapBounds.f.f);

        var url = 'api/v1/live/tweets?limit='+readTweetsLimit+'&location=';
        url = url + lngMin.toFixed(4)+','+latMin.toFixed(4)+','+lngMax.toFixed(4)+','+latMax.toFixed(4);
	    return $http({ method: 'GET', 
    	           url: url
    	}).then(function (resp) {
        var retValue = {
          newTweets: {},
          allTweets: tweets
        };
        $window._.each(resp.data, function(value, key) {
          if(!(key in tweets)) {
            retValue.newTweets[key] = retValue.allTweets[key] = value;
          }
        });
    		tweets = retValue.allTweets;
    		var toDeleteCount = Object.keys(tweets).length - markerBufferSize;
    		if( toDeleteCount > 0 ){
    			deleteOldestTweets(toDeleteCount);
    		}
      	return retValue;
    	}).catch(function(err){
        console.log(err);
    	});
   	}

    var getTweetHtml = function (tweet) {
      return $http.get('/api/v1/embed/tweet?id=' + tweet.id_str).then(function (resp) {
        return resp.data.html;
      }).catch(function (err) {
        console.log(err);
      });
    };
	
	return { 
      readTweets:readTweets,
      tweets:tweets,
      mapProp:mapProp,
      readTweetsInterval:readTweetsInterval,
      checkTweetsAgeInterval:checkTweetsAgeInterval,
      ageArr:ageArr,
      getTweetHtml:getTweetHtml
    };
})
.controller('MapViewController', function ($scope, $document, $window, $compile, MapViewState) {
  // Your code here
  $scope.map = null; 


  $scope.init = function(){
    $scope.map = new google.maps.Map($document[0].getElementById("googleMap"),MapViewState.mapProp);
    google.maps.event.addDomListener($scope.map, 'click', $scope.onMapClick);
	google.maps.event.addDomListener($scope.map, 'bounds_changed', $scope.onBoundsChanged);
    
	$scope.initMarkers();

    $scope._refreshMarkerlId = setInterval( $scope.refreshMarkers, MapViewState.readTweetsInterval);
    $scope._setAgeIntervalId = setInterval( $scope.setAgeToAll, MapViewState.checkTweetsAgeInterval);
    $scope.lazyRefresh = $window._.debounce($scope.validateMarkers, 300);
  }

  $scope.onBoundsChanged = function(event){
    $scope.saveMapState();
    $scope.lazyRefresh();
  }

  $scope.onMapClick = function(event){  
	$scope.refreshMarkers();
  }

  $scope.saveMapState = function(){
  	MapViewState.mapProp.mapBounds = $scope.map.getBounds();
  	MapViewState.mapProp.center = $scope.map.getCenter();
  	MapViewState.mapProp.mapTypeId = $scope.map.getMapTypeId();
    MapViewState.mapProp.zoom = $scope.map.getZoom();
  }

  $scope.validateMarkers = function(mapBounds){
    var keys = Object.keys(MapViewState.tweets); 
    for(var i = 0; i < keys.length; i++){
    	var marker = MapViewState.tweets[keys[i]].marker;
    	var lat = marker.getPosition().lat();
    	var lng = marker.getPosition().lng();
    	if( !MapViewState.mapProp.mapBounds.contains(marker.getPosition()) ){
    		marker.setMap(null);
    		delete MapViewState.tweets[keys[i]];
    	}
    }
  }

  $scope.refreshMarkers = function(){                
    MapViewState.readTweets().then(function(res){
    	var newTweetsKeys = Object.keys(res.newTweets);
    	var tweets = res.allTweets;
    	$window._.each(newTweetsKeys, function(key){
    		if(tweets[key]){
                var marker = $scope.createMarker(tweets[key]);
    		}
    	});
	})
  }

  $scope.setAgeToAll = function(){
  	var nowDate = new Date;
  	$window._.each(MapViewState.tweets, function(tweet){
  		var age = $scope.getAge(nowDate, tweet);
  		var icon = $scope.getIcon(age);
    	tweet.marker.setIcon(icon);
    });
  }

  $scope.getAge = function( nowDate, tweet){
  	var sec = (nowDate - tweet.date)/1000;
  	for( var i = MapViewState.ageArr.length-1; i>=0; i-- ){
  		if( sec > MapViewState.ageArr[i])
  			return i+2;
  	}
  	return 1;
  }
  $scope.getIcon = function(age) {
  	//return '/map-view/icons/tweet'+age+'.ico';
  	return '/map-view/icons/twitter'+age+'.png';
  }

  $scope.onMarkerClick = function(event){
    if (!this.getMap()._infoWindow) {
        this.getMap()._infoWindow = new google.maps.InfoWindow();
    }
    var that = this;
    // var tweetMarkup = '<twitter-widget twitter-widget-id="\'' + this.tweet.id_str +'\'"></twitter-widget>';
    // that.getMap()._infoWindow.close();
    // that.getMap()._infoWindow.setContent(tweetMarkup);
    // that.getMap()._infoWindow.open(that.getMap(),that);
    that.getMap()._infoWindow.close();
    MapViewState.getTweetHtml(this.tweet).then( function(html){
      //var tweetMarkup = '<twitter-widget twitter-widget-id="\'' + that.tweet.id_str +'\'"></twitter-widget>';
      var tweetMarkup = '<twitter-widget>'+ html +'</twitter-widget>';
      var compiled = $compile(tweetMarkup)($scope);
      that.getMap()._infoWindow.setContent(compiled[0]);
      setTimeout(function(){
        that.getMap()._infoWindow.open(that.getMap(),that);
      }, 500);
    });
  }

  $scope.createMarker = function(tweet){
  	tweet.date = new Date(tweet.created_at);
    tweet.marker = new google.maps.Marker({
        position: new google.maps.LatLng({
          lng : tweet.coordinates.coordinates[0] || $scope.randomLat(),
          lat : tweet.coordinates.coordinates[1] || $scope.randomLng()
        }),
        text: tweet.text,
        tweet: tweet
      });

    tweet.marker.setIcon( $scope.getIcon( $scope.getAge( new Date, tweet)));
    tweet.marker.setMap($scope.map);
    google.maps.event.addDomListener(tweet.marker, 'click', $scope.onMarkerClick);
  }

  $scope.$on("$destroy", function handler() {
  	$scope.saveMapState();
  	clearInterval( $scope._refreshMarkerlId);
    clearInterval( $scope._setAgeIntervalId);

  	$window._.each(MapViewState.tweets, function(tweet){
  		tweet.marker.setMap(null);
    	delete tweet.marker;
  	});
  })
  
  $scope.initMarkers = function(){
  	$window._.each(MapViewState.tweets, function(tweet){
 		$scope.createMarker(tweet);	
 	});
  }


  $scope.randomLat = function(){
	 return MapViewState.mapProp.center.lat() - 10 + Math.random()*20;
  }

  $scope.randomLng = function(){
	 return MapViewState.mapProp.center.lng() - 10 + Math.random()*20;
  }
  
  
});