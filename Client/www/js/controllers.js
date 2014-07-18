﻿angular.module('starter.controllers', [])

	.controller('LoginCtrl', function ($scope, $state, UserService) {

	    $scope.login = function (user) {
	        console.log('Log In', user);

	        UserService.login(user);

	    };

	})

	.controller('SignupCtrl', function ($scope, $state, UserService) {

	    $scope.continueSignUp = function (user) {
	        console.log('Sign up - phase 1', user);
	        UserService.fillDetails(user.username, user.password, user.email);
	        $state.go('signup2');
	    };

	    $scope.signUp = function (user) {
	        console.log('Sign up - phase 2', user);
	        UserService.fillTags(user.university, user.courses);
	        UserService.register();

	    };

	})

	.controller('ViewQuestionsCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
	    console.log('ViewQuestionsCtrl');
	    var mySwiper = new Swiper('.swiper-container', {
	        mode: 'vertical'

	    })
	    $scope.showMenu = function () {
	        $ionicSideMenuDelegate.toggleLeft();
	    };
	    //$("#app").draggable();
	    $scope.askquestion = function () {
	        $state.go('askquestion');
	    }

	    $scope.hotquestions = function () {
	        $state.go('hotquestions');
	    }
	})

    .controller('TagsCtrl', function ($scope, $state, TagsService, UserService) {
        console.log('TagsCtrl');

        var curUserId = UserService.getCurrentUser().UserID;

        // Load Tags
        TagsService.getTagsForUser(curUserId);
    })

	.controller('AskQuestionCtrl', function ($scope, $state, QuestionService, UserService) {

	    $scope.showIt = false;

	    $scope.takePic = function () {
	        navigator.camera.getPicture(onSuccess, onFail, {
	            quality: 45,
	            //destinationType: Camera.DestinationType.DATA_URL
	            destinationType: Camera.DestinationType.FILE_URI,
	            encodingType: Camera.EncodingType.JPEG,
	            sourceType: Camera.PictureSourceType.CAMERA
	        });

	    }

	    var onSuccess = function (imageUri) {
	        $scope.picData = imageUri;

	        $scope.showIt = true;
	        $scope.$apply();
	        QuestionService.setImageUri(imageUri);
	    };

	    var onFail = function (e) {
	        console.log("On fail " + e);
	    }

	    $scope.submit = function () {
	        QuestionService.setComment($scope.comment);
	        QuestionService.setTags($scope.tags);
	        QuestionService.askQuestion();
	    }

	    $scope.tags = [];

	    $scope.loadTags = function () {
	        return [];//$http.get('tags.json');
	    };
	})

    .controller('AddAnswerCtrl', function ($scope, $state, QuestionService, UserService) {

        $scope.showIt = false;

        $scope.takePic = function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 45,
                //destinationType: Camera.DestinationType.DATA_URL
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA
            });

        }

        var onSuccess = function (imageUri) {
            $scope.picData = imageUri;

            $scope.showIt = true;
            $scope.$apply();
            QuestionService.setImageUri(imageUri);
        };

        var onFail = function (e) {
            console.log("On fail " + e);
        }

        $scope.submit = function () {
            QuestionService.setComment($scope.comment);
            QuestionService.setTags($scope.tags);
            QuestionService.addAnswer();
        }

        $scope.tags = [];

        $scope.loadTags = function () {
            return [];//$http.get('tags.json');
        };
    })

    .controller('HotQuestionsCtrl', function ($scope,$state, $ionicSwipeCardDelegate, QuestionService) {
        $scope.ip = "54.72.160.154";

        QuestionService.getQuestions();
        $scope.questionslides = [];

        $scope.answer = function (qid) {
            QuestionService.setCurrentQid(qid);
            $state.go('addanswer');
        }

        $scope.seeAnswers = function (qid) {
            QuestionService.setCurrentQid(qid);
            $state.go('answers');
        }       

        $scope.cardSwiped = function (index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function (index) {
            $scope.questionslides.splice(index, 1);
        };

        $scope.addCard = function () {
            var newCard = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
            newCard.id = Math.random();
            $scope.questionslides.push(angular.extend({}, newCard));
        }

        $scope.goAway = function () {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    })
 .controller('AnswersCtrl', function ($scope, $ionicSwipeCardDelegate, QuestionService) {
     $scope.ip = "54.72.160.154";
     QuestionService.getAnswersForQuestion();
     $scope.answersslide = [];
     
     $scope.cardSwiped = function (index) {
         $scope.addCard();
     };

     $scope.cardDestroyed = function (index) {
         $scope.answersslide.splice(index, 1);
     };

     $scope.addCard = function () {
         if ($scope.answers != undefined)
         {
             var newCard = $scope.answers[Math.floor(Math.random() * $scope.answers.length)];
             newCard.id = Math.random();
             $scope.answersslide.push(angular.extend({}, newCard));
         }
         
     }

     $scope.goAway = function () {
         var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
         card.swipe();
     };
 });
