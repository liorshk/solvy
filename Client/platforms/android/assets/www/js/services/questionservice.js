services.factory('QuestionService', function ($http, $rootScope, $state, $window, IP, UserService, Utils) {

    var question = {};

    return {
        setImageUri: function (imageuri) {
            question.imageuri = imageuri;
        },
        setCurrentQid: function(qid)
        {
            $window.localStorage.setItem("qid", qid);
        },
        setDetails: function (title, details) {
            question.title = title;
            question.details = details;
        },
        setTags: function (tags) {
            question.tags = [];
            tags.forEach(function (tag) {
                question.tags.push(tag);
            });

        },
        askQuestion: function (callbackSuccess, callbackError) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = question.imageuri.substr(question.imageuri.lastIndexOf('/') + 1) + '.jpg';
            options.mimeType = "image/jpeg";

            var params = {};
            params.title = question.title;
            params.details = question.details;
            params.UserId = UserService.getCurrentUser().UserID;

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(question.imageuri, "http://" + IP + "/AskQuestion",
                function (res) {
                    var response = angular.fromJson(res.response);

                    $http({
                        url: "http://" + IP + "/SetTagsToQuestion",
                        method: "POST",
                        data: "data=" + JSON.stringify({ questionId: response.QuestionID, tags: question.tags }),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .then(function (data) {
                        callbackSuccess(data);
                    });
                }, function (err) {
                    callbackError(err);
                }, options);
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
        getQuestionsForTag: function (tagName) {
            return $http({
                url: "http://" + IP + "/GetQuestionsForTag/" + tagName,
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (data, status, headers, config) {
                return angular.fromJson(data);
            })
            .error(function (data, status, headers, config) { // optional
                // failed
            })
        },
        getQuestionsForTagAndUser: function (tagName, userId) {
            return $http({
                url: "http://" + IP + "/GetQuestionsForTagAndUser/" + tagName + "/" + userId,
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (data, status, headers, config) {
                return angular.fromJson(data);
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



//askQuestion: function (callbackSuccess,callbackError) {

//    var fileName = question.imageuri.substr(question.imageuri.lastIndexOf('/') + 1) + '.jpg';

//    var qData = {};
//    qData.title = question.title;
//    qData.details = question.details;
//    qData.UserId = UserService.getCurrentUser().UserID;
            
//    Utils.uploadToS3(question.imageuri, fileName)
//        .then(function (data) {
//            $http({
//                url: "http://" + IP + "/AskQuestion",
//                method: "POST",
//                data: "data=" + JSON.stringify(qData),
//                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//            })
//            .then(function (res) {
//                var response = angular.fromJson(res.response);

//                $http({
//                    url: "http://" + IP + "/SetTagsToQuestion",
//                    method: "POST",
//                    data: "data=" + JSON.stringify({ questionId: response.QuestionID, tags: question.tags }),
//                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//                })
//                .then(function (data) {
//                    callbackSuccess(data);
//                });
//            })
//        .catch(function (err) {


//        });
                
//        }, function (err) {
//            callbackError(err);
//        }, options);
//},