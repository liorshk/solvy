controllers.controller('LoginCtrl', function ($scope, $state, UserService) {
    
    // TODO - remove and secure this
    if (UserService.getCurrentUser() != undefined) {

        UserService.getAllUsers().then(function (users) {
            for (var i in users) {
                if (users[i].user_id == UserService.getCurrentUser().UserID) {
                    $state.go('app.home');
                }
            }
        });
        
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
