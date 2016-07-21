'use strict';

angular.module('twigbro.mapView', [])
.factory('MapViewState', function($window, $http){
	var tweets = {};
	var markerBufferSize = 4000;
	var readTweetsLimit = 200;
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
				marker.setMap(null);
			}
			delete tweets[keyArr[i]];
		}
	}

	var readTweets = function(){
		var latMinn = mapBounds.b.b;
		var lngMin = mapBounds.b.f;
		var latMax = mapBounds.f.b;
		var lngMax = mapBounds.f.f;

        var url = 'api/v1/live/tweets?limit='+readTweetsLimit+'&location=';
        url = url + latMin.toFixed(4)+','+lngMin.toFixed(4)+','+latMax.toFixed(4)+','+lngMax.toFixed(4);
	    return $http({ method: 'GET', 
    	           url: url
    	}).then(function (resp) {
    		$window._.extend( tweets, resp.data);
    		var toDeleteCount = Object.keys(tweets).length - markerBufferSize;
    		if( toDeleteCount > 0 ){
    			deleteOldestTweets(toDeleteCount);
    		}
      		return { newTweets : resp.data, allTweets : tweets };
    	}).catch(function(err){

    	})
   	}
	
	return { 
      readTweets:readTweets,
      tweets:tweets,
      mapProp:mapProp
    };
})
.controller('MapViewController', function ($scope, $document, $window, MapViewState) {
  // Your code here
  $scope.indx = 0; 
  $scope.markers = [];
  $scope.map = null; 

  $scope.readTweetsInterval = 1000;
  $scope.checkTweetsAgeInterval = 5000;
 
  // in seconds (<20) age === 1, (<40)age === 2 etc 
  $scope.ageArr = [20,40,60,80,100,120,140,160,180];


  $scope.init = function(){
    $scope.map = new google.maps.Map($document[0].getElementById("googleMap"),MapViewState.mapProp);
    google.maps.event.addDomListener($scope.map, 'click', $scope.onMapClick);
	google.maps.event.addDomListener($scope.map, 'bounds_changed', $scope.onBoundsChanged);
    
	$scope.initMarkers();

    //setInterval( refreshMarkers, readTweetsInterval);
    setInterval( $scope.setAgeToAll, $scope.checkTweetsAgeInterval);
  }

  $scope.onBoundsChanged = function(event){
    $scope.saveMapState();
  	$scope.validateMarkers();

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
    	if( !mapBounds.contains(marker.getPosition()) ){
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
                marker.setMap($scope.map);
                google.maps.event.addDomListener(marker, 'click', $scope.onMarkerClick);
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
  	for( var i = $scope.ageArr.length-1; i>=0; i-- ){
  		if( sec > $scope.ageArr[i])
  			return i+2;
  	}
  	return 1;
  }
  $scope.getIcon = function(age) {
  	return '/map-view/icons/tweet'+age+'.ico';
  }

  $scope.onMarkerClick = function(event){
    if (!this.getMap()._infoWindow) {
        this.getMap()._infoWindow = new google.maps.InfoWindow();
    }
    this.getMap()._infoWindow.close();
    this.getMap()._infoWindow.setContent(this.text);
    this.getMap()._infoWindow.open(this.getMap(), this);
  }

  $scope.createMarker = function(tweet){
  	tweet.date = new Date(tweet.created_at);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng({
          lat : tweet.coordinates.coordinates[0] || $scope.randomLat(),
          lng : tweet.coordinates.coordinates[1] || $scope.randomLng()
        }),
        text: tweet.text
      });
    tweet.marker = marker;
    tweet.marker.setIcon( $scope.getIcon( $scope.getAge( new Date, tweet)));
    return marker;
  }

  $scope.$on("$destroy", function handler() {
  	$scope.saveMapState();
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