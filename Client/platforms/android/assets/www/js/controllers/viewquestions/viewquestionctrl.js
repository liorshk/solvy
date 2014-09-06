/// <reference path="viewquestionctrl.js" />
controllers.controller('ViewQuestionsCtrl', function ($scope, $rootScope, $ionicModal, $state, $ionicSideMenuDelegate, QuestionService) {
    console.log('ViewQuestionsCtrl');
    $scope.questions = [];
    $scope.selectedTag = null;

    function loadQuestionsForTag(tag) {
        QuestionService.getQuestionsForTag(tag.name).
                                   success(function (data) {
                                       if (data.IsSuccess) {
                                           $scope.questions = $scope.questions.concat(data.Questions);
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
        loadQuestionsForTag(tag);
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

        
})