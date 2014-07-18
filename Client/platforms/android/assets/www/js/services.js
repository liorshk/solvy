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
                $window.localStorage.setItem("username", user.username);
                $window.localStorage.setItem("university", user.university);
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
	    var answer = {};

	    return {
	        setImageUri: function (imageuri) {
	            question.imageuri = imageuri;
	            answer.imageuri = imageuri;
	        },
	        setCurrentQid: function(qid)
	        {
	            $window.localStorage.setItem("qid", qid);
	        },
	        setComment: function (comment) {
	            question.comment = comment;
	            answer.comment = comment;
	        },
	        setTags: function (tags) {
	            question.tags = [];
	            tags.forEach(function (tag) {
	                question.tags.push(tag.text);
	            });

	            answer.tags = [];
	            tags.forEach(function (tag) {
	                answer.tags.push(tag.text);
	            });
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

	        getAnswersForQuestion: function () {
	            $http({
	                url: "http://" + ip + "/GetAllSolutionForQuestion/" + $window.localStorage.getItem("qid"),
	                method: "GET",
	                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	            })
                .success(function (data, status, headers, config) {
                    $rootScope.answers = angular.fromJson(data);
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
	            if ($window.localStorage.getItem("university") != undefined)
	            {
	                params.university = $window.localStorage.getItem("university");
	            }
	            params.tags = question.tags;
	            options.params = params;
	            var ft = new FileTransfer();
	            ft.upload(question.imageuri, "http://" + ip + "/AskQuestion", function () { $state.go('hotquestions'); }, function () { }, options);
	        },

	        addAnswer: function () {
	            var options = new FileUploadOptions();
	            options.fileKey = "file";
	            options.fileName = answer.imageuri.substr(answer.imageuri.lastIndexOf('/') + 1) + '.jpg';
	            options.mimeType = "image/jpeg";
	            
	            var params = {};
	            params.comment = answer.comment;
	            params.username = $window.localStorage.getItem("username");
	            params.tags = answer.tags;
	            if ($window.localStorage.getItem("university") != undefined) {
	                params.university = $window.localStorage.getItem("university");
	            }
	            params.questionId = $window.localStorage.getItem("qid");
	            options.params = params;
	            var ft = new FileTransfer();
	            ft.upload(answer.imageuri, "http://" + ip + "/AddAnswerToQuestion", function () { $state.go('hotquestions'); }, function () { }, options);
	        }
	    }
	});