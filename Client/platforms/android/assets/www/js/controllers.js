angular.module('starter.controllers', ['ngTagsInput'])

	.controller('LoginCtrl', function ($scope, $state, UserService) {
	  
	    $scope.login = function (user) {
	      console.log('Log In', user);

	      UserService.login(user);
		
	  };
	  
	})
	
	.controller('SignupCtrl', function ($scope, $state, UserService) {
	  
	  $scope.continueSignUp = function(user) {
		console.log('Sign up - phase 1', user);
		UserService.fillDetails(user.username, user.password, user.email);
		$state.go('signup2');
	  };
	  
	  $scope.signUp = function(user) {
	      console.log('Sign up - phase 2', user);
	      UserService.fillTags(user.university, user.courses);
	      UserService.register();
		  
	  };
	  
	})

	.controller('HomeTabCtrl', function($scope,$state) {
	    console.log('HomeTabCtrl');
	    //$("#app").draggable();
	    $scope.askquestion = function () {
	        $state.go('askquestion');
	    }
        
	    $scope.hotquestions = function () {
	        $state.go('hotquestions');
	    }
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
			
	    };

		var onFail = function(e) {
		    console.log("On fail " + e);
		}

		$scope.submit = function()
		{
		    QuestionService.setComment($scope.comment);
		    QuestionService.setTags($scope.tags);
		    QuestionService.askQuestion($scope.picData);
		}

		$scope.tags = [];
        
		$scope.loadTags = function () {
		    return [];//$http.get('tags.json');
		};
	})

    .controller('HotQuestionsCtrl', function ($scope, UserService, QuestionService) {
        $scope.ip = "54.72.160.154";
        QuestionService.getQuestions();
    });