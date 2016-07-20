'use strict';

angular.module('twigbro.mapView', [])
.factory('MapViewState', function($http){
	var tweets = {};
	
	var readTweets = function(){
// api/v1/live/tweets?limit=<number>&location=-74.0,40.0,-73.0,41.0
	    return $http({ method: 'GET', 
    	           url: 'api/v1/live/tweets?limit=100&location=-74.0,40.0,-73.0,41.0'
    	}).then(function (resp) {
      		return resp.data;
    	}).catch(function(err){

    	})
   	}
	
	return { 
      readTweets:readTweets,
      tweets:tweets
    };
})
.controller('MapViewController', function ($scope, $document, MapViewState) {
  // Your code here
  $scope.indx = 0; 
  $scope.markers = []; 

  $scope.init = function(){
    var mapProp = {
      center:new google.maps.LatLng(50.1055, 19.8433),
      zoom:5,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map($document[0].getElementById("googleMap"),mapProp);
    //map = new google.maps.Map($document.find("googleMap"),mapProp);
    google.maps.event.addDomListener($scope.map, 'click', $scope.onMapClick);
  }


  $scope.onMapClick = function(event){  
/*    var comment = prompt('Provide comment', ' ');            
    var newSite = { lat : event.latLng.lat().toFixed(4),
                    lng : event.latLng.lng().toFixed(4),
                    comment : comment }*/
    MapViewState.readTweets();
  }
});