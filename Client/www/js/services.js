angular.module('starter.services', [])

    .factory('UserService', function ($http, $rootScope, $state, $window) {
        var ip = "54.72.160.154";
        //var ip = "10.10.8.90";
        var user = {};

        return {
            fillDetails: function (username, password, email) {
                user.username = username;
                user.password = password;
                user.email = email;
            },
            fillTags: function (university, courses) {
                user.university = university;
                user.courses = courses;
            },

            register: function () {

                $http({
                    url: "http://"+ip+"/AddUser",
                    method: "POST",
                    data: "data=" + JSON.stringify(user),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    var parsedData = angular.fromJson(data);
                    // success
                    if (parsedData.IsSuccess) {
                        user.id = parsedData.UserID;
                        $state.go('tabs.home');
                    }
                })
                .error(function (data, status, headers, config) { // optional
                    // failed
                    $rootScope.errormessage = 'Error';
                }
                );
            },

            login: function (user) {
                this.user = user;
                $window.localStorage.setItem("username", user.username);
                $http({
                    url: "http://"+ip+"/LogIn",
                    method: "POST",
                    data: "data=" + JSON.stringify(user),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    // success
                    if (angular.fromJson(data) || data) {
                        $state.go('tabs.home');
                    }
                })
                .error(function (data, status, headers, config) { // optional
                    // failed
                    $rootScope.errormessage = 'Error';
                }
                );
            },

            getUser: function () {
                return user;
            }
        }
    })
	.factory('QuestionService', function ($http, $rootScope, $state, $window) {
	    var ip = "54.72.160.154";
	    //var ip = "10.10.8.90";
	    var question = {};

	    return {
	        setImageUri: function (imageuri) {
	            question.imageuri = imageuri;
	            $rootScope.message = question.imageuri;
	        },
	        setComment: function (comment) {
	            question.comment = comment;
	        },
	        setTags: function (tags) {
	            question.tags = tags;
	        },

	        getQuestions: function () {
	            $http({
	                url: "http://" + ip + "/GetQuestions",
	                method: "GET",
	                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	            })
                .success(function (data, status, headers, config) {
                    $rootScope.questions = angular.fromJson(data);
                })
                .error(function (data, status, headers, config) { // optional
                    // failed
                })
	        },

	        askQuestion: function () {
	            var options = new FileUploadOptions();
	            options.fileKey = "file";
	            options.fileName = question.imageuri.substr(question.imageuri.lastIndexOf('/') + 1) + '.jpg';
	            options.mimeType = "image/jpeg";
	            
	            var params = {};
	            params.comment = question.comment;
	            params.username = $window.localStorage.getItem("username");
	            options.params = params;
	            var ft = new FileTransfer();
	            ft.upload(question.imageuri, "http://" + ip + "/AskQuestion", function () { $state.go('hotquestions'); }, function () { }, options);
	        }
	    }
	});