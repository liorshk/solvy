/// <reference path="signup.js" />
/// <reference path="signupctrl.js" />
controllers.controller('SignupCtrl', function ($scope, $state, UserService, TagsService) {

    $scope.continueSignUp = function (user) {
        console.log('Sign up - phase 1', user);
        UserService.fillDetails(user.username, user.password, user.email);
        $state.go('signup2');
    };

    $scope.signUp = function (user) {
        console.log('Sign up - phase 2', user);
        UserService.fillTags(user.university, user.courses);
        UserService.register()
            .then(function (data) {

                // Set Tags
                var tags = [user.university].concat(user.courses);
                TagsService.setTagsToUser(user.UserID, tags).then(function (data) {
                    $state.go('app.home');
                })
                 .catch(function (data) {
                     $scope.errormessage = "Failed on setting tags";
                 });
            })
            .catch(function (data) {
                $scope.errormessage = "Failed on adding user";
            });

    };

})
