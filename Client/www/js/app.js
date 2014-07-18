// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','starter.services', 'starter.controllers','starter.directives'])
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
        .state('askquestion', {
            url: "/askquestion",
            templateUrl: "templates/questions/askquestion.html",
            controller: 'AskQuestionCtrl'
        })

	    // Ask Question
	    .state('hotquestions', {
	        url: "/hotquestions",
	        templateUrl: "templates/questions/hotquestions.html",
	        controller: 'HotQuestionsCtrl'
	    })
	    // Add Answer
	    .state('addanswer', {
	        url: "/addanswer",
	        templateUrl: "templates/questions/addanswer.html",
	        controller: 'AddAnswerCtrl'
	    })
        // Answers
	    .state('answers', {
	        url: "/answers",
	        templateUrl: "templates/questions/answers.html",
	        controller: 'AnswersCtrl'
	    });

	    $urlRouterProvider.otherwise("/login");

	})

.directive('noScroll', function ($document) {

    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {

            $document.on('touchmove', function (e) {
                e.preventDefault();
            });
        }
    }
});

	
