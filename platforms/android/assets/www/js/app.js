// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
<<<<<<< HEAD
angular.module('app', ['ionic','tabSlideBox','ion-google-place','ionic.closePopup', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
=======
angular.module('app', ['ionic','ionic-material','tabSlideBox','ion-google-place','ionic.closePopup', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
>>>>>>> 309a37cacb4a799283961c8e62e6713a30e22f4a

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
