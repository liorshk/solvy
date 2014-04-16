angular.module('starter.controllers',[])

	.controller('LoginCtrl', function($scope, $state) {
	  
	  $scope.signIn = function(user) {
	      console.log('Log In', user);

	      $http
                .post('/authenticate', user)
                .success(function (data, status, headers, config) {
                    $window.sessionStorage.token = data.token;
                    $scope.message = 'Welcome';
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;

                    // Handle login errors here
                    $scope.message = 'Error: Invalid user or password';
                });
		$state.go('tabs.home');
	  };
	  
	})
	
	.controller('SignupCtrl', function($scope, $state) {
	  
	  $scope.continueSignUp = function(user) {
		console.log('Sign up - phase 1', user);
		//User.fillDetails(user.username,user.password,user.email);
		$state.go('signup2');
	  };
	  
	  $scope.signUp = function(user) {
		console.log('Sign up - phase 2', user);
		$state.go('tabs.home');
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