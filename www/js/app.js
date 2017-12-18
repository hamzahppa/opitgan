angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'ngCordova', 'ngStorage', 'ionic-ratings', 'ionicLazyLoad', 'ionMDRipple', 'ngCordovaOauth', 'ion-floating-menu','plgn.ionic-segment', 'aCarousel'])
.run(function($ionicPlatform, $ionicPopup, Services, $localStorage, $timeout, $state, Analytics, $ionicHistory) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {			
			StatusBar.styleDefault();
		}

		// Analytics.logEvent('Subscribe', 'mangan');
	})

	// $ionicPlatform.registerBackButtonAction(function (event) {
	// 	if ($ionicHistory.currentStateName() === 'wizard' || $ionicHistory.currentStateName() === 'registration'){
	// 		event.preventDefault();
	// 	} else if($ionicHistory.currentStateName() === 'jelajah') {
	// 		navigator.app.exitApp();
	// 	}else {
	// 		$ionicHistory.goBack();
	// 	}
	// }, 100);
})

.config(function($ionicConfigProvider) {
	$ionicConfigProvider.navBar.alignTitle('left');
	$ionicConfigProvider.scrolling.jsScrolling(false);
})

.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a,b) {
        return (a[field] > b[field] ? 1: -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
})