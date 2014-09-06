controllers.controller('LoginCtrl', function ($scope, $state, UserService) {
    
    // TODO - remove and secure this
    if (UserService.getCurrentUser() != undefined) {

        for (var user in UserService.getAllUsers()) {
            if (user.user_id == UserService.getCurrentUser().UserID)
            {
                $state.go('app.home');
            }
        }
    }

    $scope.login = function (user) {
        console.log('Log In', user);


        UserService.login(user)
                    .then(function (data) {
                        $state.go('app.home');
                    })
                    .catch(function (data) {
                        $scope.errormessage = "Error Message";
                    });

    };

})
