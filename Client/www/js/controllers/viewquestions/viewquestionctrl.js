/// <reference path="viewquestionctrl.js" />
controllers.controller('ViewQuestionsCtrl', function ($scope, $rootScope, $ionicModal, $state, $ionicSideMenuDelegate, QuestionService, UserService) {
    console.log('ViewQuestionsCtrl');
    $scope.questions = [];
    $scope.selectedTag = null;
    $scope.questionCards =[];

    function loadQuestionsForTag(tag) {
        console.log("Getting Questions for " + tag.name);
        QuestionService.GetQuestionsForTagAndFavoriteForUser(tag.name, UserService.getCurrentUser().UserID).
                                   success(function (data) {
                                       if (data.IsSuccess) {

                                           // TODO - unique concat
                                           $scope.questions = $scope.questions.concat(data.Questions);

                                           $scope.curIndex = 0;
                                           $scope.updateCurrentQuestion();
                                       }
                                   });
    }

    function loadFavoriteQuestions() {
        console.log("Getting Favorite Questions for user: " + UserService.getCurrentUser().UserID);
        QuestionService.getFavoriteQuestionsForUser(UserService.getCurrentUser().UserID).
                                   success(function (data) {
                                       if (data.IsSuccess) {

                                           // TODO - unique concat
                                           $scope.questions = $scope.questions.concat(data.Questions);

                                           $scope.curIndex = 0;
                                           $scope.updateCurrentQuestion();
                                       }
                                   });
    }

    var loaded = false;
    $rootScope.$watch("tags", function (tags) {
        if (!loaded && tags != undefined) {
            for (var index in tags) {
                loadQuestionsForTag(tags[index]);
            }
            loaded = true;
        }
    });

    $scope.selectTag = function (tag) {
        $scope.questions = [];
        $scope.selectedTag = tag;
        $scope.favoriteSelected = false;
        loadQuestionsForTag(tag);
    }

    $scope.selectFavorites = function () {
        $scope.questions = [];
        $scope.selectedTag = null;
        $scope.favoriteSelected = true;
        loadFavoriteQuestions();
    }


    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };

    $ionicModal.fromTemplateUrl('templates/fullscreenmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.showFullScreen = function (image) {
        $scope.currentImageFullscreen = image;
        $scope.modal.show();
    }

    $scope.closeFullscreen = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.cardSwiped = function(index) {
        $scope.curIndex++;

        $scope.updateCurrentQuestion();
        
    };

    $scope.cardDestroyed = function (index) {
    };


    $scope.updateCurrentQuestion = function () {
        $scope.questionCards[0] = $scope.questions[$scope.curIndex];
        if ($scope.questionCards[0] == undefined) {
            $scope.questionCards = [];
        }
    }

    $scope.favorite = function (question) {
        QuestionService.setFavorite(question.question_id);
        question.isFavorite = true;
    }
    
})