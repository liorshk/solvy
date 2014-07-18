angular.module('starter.services', [])
     .constant("IP", "localhost")
    .service('UserService', function ($http, $rootScope, $state, $window, IP) {

        var user = {};       

        this.getUser = function () {
            return user;
        };


        this.getCurrentUser = function () {
            return JSON.parse($window.localStorage.getItem("userDetails"));
        };

        this.fillDetails = function (username, password, email) {
            user.username = username;
            user.password = password;
            user.email = email;
        };
        
        this.fillTags = function (university, courses) {
            user.university = university;
            user.courses = courses;
        };

        this.saveUserDetails = function (user) {
            this.user = user;

            // Saving the user details
            var userNoPass = user;
            userNoPass.password = "";
            $window.localStorage.setItem("userDetails", JSON.stringify(userNoPass));
        };

        this.register = function () {

            var saveUserDetailsCallback = this.saveUserDetails;

            $http({
                url: "http://" + IP + "/AddUser",
                method: "POST",
                data: "data=" + JSON.stringify(user),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (data, status, headers, config, saveUserDetails) {
                var parsedData = angular.fromJson(data);
                // success
                if (parsedData.IsSuccess) {
                    user.UserID = parsedData.UserID;

                    saveUserDetailsCallback(user);

                    $state.go('app.home');
                }
            })
            .error(function (data, status, headers, config) { // optional
                // failed
                $rootScope.errormessage = 'Error';
            }
            );
        };

        this.login = function (user) {

            var saveUserDetailsCallback = this.saveUserDetails;

            $http({
                url: "http://" + IP + "/LogIn",
                method: "POST",
                data: "data=" + JSON.stringify(user),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (data, status, headers, config) {
                // success
                var parsedData = angular.fromJson(data);
                if (parsedData.IsSuccess)
                {
                    user.UserID = parsedData.UserID;

                    saveUserDetailsCallback(user);

                    $state.go('app.home');
                }
                else
                {
                    $rootScope.errormessage = 'Failed to login';
                }
            })
            .error(function (data, status, headers, config) { // optional
                // failed
                $rootScope.errormessage = 'Error';
            }
            );
        };

       
    })
	.factory('QuestionService', function ($http, $rootScope, $state, $window, IP) {

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
	                url: "http://" + IP + "/GetQuestions",
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
	                url: "http://" + IP + "/GetAllSolutionForQuestion/" + $window.localStorage.getItem("qid"),
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
	})
    .factory('QuestionService', function ($http, $rootScope, $state, $window, IP) {

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
                    url: "http://" + IP + "/GetQuestions",
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
                    url: "http://" + IP + "/GetAllSolutionForQuestion/" + $window.localStorage.getItem("qid"),
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
    })
    .factory('TagsService', function ($http, $rootScope, $state, $window, IP) {
        
        return {
            
            getTags: function () {
                $http({
                    url: "http://" + IP + "/GetTags",
                    method: "GET",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    $rootScope.tags = angular.fromJson(data);
                })
                .error(function (data, status, headers, config) { // optional
                    // failed
                })
            },

            getTagsForUser: function (UserID) {
                $http({
                    url: "http://" + IP + "/GetTagsForUser/" + UserID,
                    method: "GET",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    $rootScope.tags = angular.fromJson(data);
                })
                .error(function (data, status, headers, config) { // optional
                    // failed
                })
            },

            addTag: function (tag) {
                $http({
                    url: "http://" + IP + "/addTag",
                    method: "POST",
                    data: "data=" + JSON.stringify(tag),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                 .success(function (data, status, headers, config) {
                     // success
                     if (angular.fromJson(data) || data) {
                         $state.go('app.home');
                     }
                 })
                 .error(function (data, status, headers, config) { // optional
                     // failed
                     $rootScope.errormessage = 'Error';
                 }
                 );
            }
        }
    });