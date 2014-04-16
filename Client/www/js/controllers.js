angular.module('starter.controllers', [])

	.controller('LoginCtrl', function ($scope, $state, UserService) {
	  
	  $scope.signIn = function(user) {
	      console.log('Log In', user);

	      UserService.login(user);
		
	  };
	  
	})
	
	.controller('SignupCtrl', function ($scope, $state,UserService) {
	  
	  $scope.continueSignUp = function(user) {
		console.log('Sign up - phase 1', user);
		UserService.fillDetails(user.username, user.password, user.email);
		$state.go('signup2');
	  };
	  
	  $scope.signUp = function(user) {
	      console.log('Sign up - phase 2', user);
	      UserService.fillTags({ university: user.university, courses: user.courses });
	      UserService.register();
		  
	  };
	  
	})

	.controller('HomeTabCtrl', function($scope) {
	  console.log('HomeTabCtrl');
	})
	
	.controller('CameraCtrl', function ($scope) {        
		 $scope.takePic = function() {
			var options =   {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
				encodingType: 0     // 0=JPG 1=PNG
			}
			navigator.camera.getPicture(onSuccess,onFail,options);
		}
		var onSuccess = function(FILE_URI) {
			console.log(FILE_URI);
			$scope.picData = FILE_URI;
			$scope.$apply();
		};
		var onFail = function(e) {
			console.log("On fail " + e);
		}
		$scope.send = function() {   
			var myImg = $scope.picData;
			var options = new FileUploadOptions();
			options.fileKey="post";
			options.chunkedMode = false;
			var params = {};
			params.user_token = localStorage.getItem('auth_token');
			params.user_email = localStorage.getItem('email');
			options.params = params;
			var ft = new FileTransfer();
			ft.upload(myImg, encodeURI("https://example.com/posts/"), onUploadSuccess, onUploadFail, options);
		}
		});