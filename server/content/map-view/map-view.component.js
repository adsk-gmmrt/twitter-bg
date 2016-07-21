'use strict';

angular.
  module('twigbro.mapView').
  component('mapView', {
    templateUrl: 'map-view/map-view.template.html',
    controller: [ 
      
      function MapViewController() {
      	console.log('MapViewController');
      	this.init = function(){
      		console.log('init MapController');
			var mapProp = {
      			center:new google.maps.LatLng(50.1055, 19.8433),
      			zoom:5,
      			mapTypeId:google.maps.MapTypeId.ROADMAP
    		};
    		this.map = new google.maps.Map($document[0].getElementById("googleMap"),mapProp);
       		google.maps.event.addDomListener(this.map, 'click', this.onMapClick);
       	};

       	this.onMapClick = function(event){
        }
      }
    ]
  });