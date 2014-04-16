// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','starter.services','starter.controllers'])
	// .run(function($ionicPlatform) {
	  // $ionicPlatform.ready(function() {
		// if(window.StatusBar) {
		  // //org.apache.cordova.statusbar required
		  // StatusBar.styleDefault();
		// }
	  // });
	// })

	.config(function($stateProvider, $urlRouterProvider) {

	  $stateProvider
		.state('login', {
		  url: "/login",
		  templateUrl: "templates/login.html",
		  controller: 'LoginCtrl'
		})
		.state('signup1', {
		  url: "/signup",
		  templateUrl: "templates/signup.html",
		  controller: 'SignupCtrl'
		})
		.state('signup2', {
		  url: "/signup2",
		  templateUrl: "templates/signupcontinue.html",
		  controller: 'SignupCtrl'
		})
		.state('forgotpassword', {
		  url: "/forgotpassword",
		  templateUrl: "templates/forgotpassword.html"
		})
		.state('tabs', {
		  url: "/tab",
		  abstract: true,
		  templateUrl: "templates/tabs.html"
		})
		.state('tabs.home', {
		  url: "/home",
		  views: {
			'home-tab': {
			  templateUrl: "templates/home.html",
			  controller: 'HomeTabCtrl'
			}
		  }
		})
		.state('tabs.facts', {
		  url: "/facts",
		  views: {
			'home-tab': {
			  templateUrl: "templates/facts.html"
			}
		  }
		})
		.state('tabs.facts2', {
		  url: "/facts2",
		  views: {
			'home-tab': {
			  templateUrl: "templates/facts2.html"
			}
		  }
		})
		.state('tabs.about', {
		  url: "/about",
		  views: {
			'about-tab': {
			  templateUrl: "templates/about.html"
			}
		  }
		})
		.state('tabs.navstack', {
		  url: "/navstack",
		  views: {
			'about-tab': {
			  templateUrl: "templates/nav-stack.html"
			}
		  }
		})
		.state('tabs.contact', {
		  url: "/contact",
		  views: {
			'contact-tab': {
			  templateUrl: "templates/contact.html"
			}
		  }
		});


	   $urlRouterProvider.otherwise("/signup");

	});

	
