angular.module('twigbro.main', [])

.service('twigBroAPIService', function($http){
  this.profile = {
    userName: 'Not signed in'
  };

  this.tweets = [];  

  this.getProfile = function(){
    return this.profile;
  };

  this.getTweets = function(){
    return this.tweets;
  };

  var that = this;

  this.refreshProfile = function() {
    $http.get('/api/v1/userprofile')
      .then(function(response){
        that.profile = {
          userName: response.data.displayName,
          photoHref: response.data.photos[0].value
        };
      });
  };
  this.refreshTweets = function() {
    $http.get('/api/v1/usertweets')
      .then(function(response){
        that.tweets = response.data;
      });
  };
  this.refresh = function() {
    this.refreshTweets();
    this.refreshProfile();
    return this;
  };


})

.controller('twigbroNavController', function($scope, twigBroAPIService) {
  $scope.api = twigBroAPIService.refresh();
})

.controller('twigbroTweetsController', function($scope, twigBroAPIService) {
  $scope.api = twigBroAPIService.refresh();
});
