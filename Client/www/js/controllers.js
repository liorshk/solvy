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
	    $scope.askquestion = function () {
	        $state.go('askquestion');
	    }
	})
	
	.controller('AskQuestionCtrl', function ($scope) {        
		 $scope.takePic = function() {
			var options =   {
				quality: 50,
				//destinationType: Camera.DestinationType.FILE_URI,
				sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
				encodingType: 0     // 0=JPG 1=PNG
			}
			navigator.camera.getPicture(onSuccess,onFail,options);
		}
		 var onSuccess = function (imageData) {
			$scope.picData = "data:image/jpeg;base64," + imageData;
			$scope.$apply();
		};
		var onFail = function(e) {
			console.log("On fail " + e);
		}

		$scope.tags = [];

		$scope.loadTags = function () {
		    return $http.get('tags.json');
		};
	});