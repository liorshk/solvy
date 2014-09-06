
angular.module('solvy', ['ionic','solvy.services', 'solvy.controllers','solvy.directives'])
	 .run(function ($ionicPlatform) {
	     $ionicPlatform.ready(function () {
	         if (window.StatusBar) {
	             //org.apache.cordova.statusbar required
	             StatusBar.styleDefault();
	         }
	     });
	 })

	.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	    // Login
	    $stateProvider
          .state('login', {
              url: "/login",
              templateUrl: "templates/login/login.html",
              controller: 'LoginCtrl'
          })
          // Signup
          .state('signup1', {
              url: "/signup",
              templateUrl: "templates/login/signup.html",
              controller: 'SignupCtrl'
          })
          .state('signup2', {
              url: "/signup2",
              templateUrl: "templates/login/signupcontinue.html",
              controller: 'SignupCtrl'
          })
          .state('forgotpassword', {
              url: "/forgotpassword",
              templateUrl: "templates/login/forgotpassword.html"
          })
         .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/tabs.html"
         })
            // View Questions / Home
            .state('app.home', {
                url: "/home",
                views: {
                    'home': {
                        templateUrl: "templates/viewquestions.html",
                        controller: "ViewQuestionsCtrl"
                    }
                }
            })
            // Ask Question
            .state('app.askquestion', {
                url: "/askquestion",
                views: {
                    'askQuestion': {
                        templateUrl: "templates/askquestion.html",
                        controller: 'AskQuestionCtrl'
                    }
                }
            })


	    $urlRouterProvider.otherwise("/login");

	});

	
