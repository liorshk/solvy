/// <reference path="askquestionctrl.js" />
controllers.controller('AskQuestionCtrl', function ($scope, $state, QuestionService, UserService, TagsService) {
    console.log('AskQuestionCtrl');
        
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

        loadTags();
        QuestionService.setImageUri(imageUri);
    };

    // Mimic
    onSuccess("templates/sampleImg.jpg");

    var onFail = function (e) {
        console.log("On fail " + e);
        $state.go("app.home")
    }

    $scope.submit = function () {
        QuestionService.setDetails($scope.title,$scope.details);
        QuestionService.setTags($scope.mytags);
        QuestionService.askQuestion(
            function (data) {
                console.log(data);
                $state.go("app.home")
            },
            function (err) {
                console.log(err);
            });
    }

    $scope.mytags = [];

    // On Start
    //$scope.takePic();

    function loadTags(){
        var curUserId = UserService.getCurrentUser().UserID;

        // Load Tags
        TagsService.getTagsForUser(curUserId)
                        .then(function(tags){
                            $scope.mytags = tags;
                        });
                                
    };
})