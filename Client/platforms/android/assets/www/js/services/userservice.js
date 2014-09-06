services.service('UserService', function ($http, $window, IP) {

    var user = {};       

    this.getUser = function () {
        return user;
    };

    // Returns user: {UserID,username}
    this.getCurrentUser = function () {
        if ($window.localStorage.getItem("userDetails") != null) {
            return JSON.parse($window.localStorage.getItem("userDetails"));
        }
        return undefined;
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

        return $http({
            url: "http://" + IP + "/AddUser",
            method: "POST",
            data: "data=" + JSON.stringify(user),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (data) {
                var parsedData = angular.fromJson(data);
                // success
                if (parsedData.data.IsSuccess) {
                    user.UserID = parsedData.data.UserID;                        

                    saveUserDetailsCallback(user);
                }

                // Let the controller handle the response
                return parsedData.data;
            });
    };

    this.login = function (user) {

        var saveUserDetailsCallback = this.saveUserDetails;
        return $http({
            url: "http://" + IP + "/LogIn",
            method: "POST",
            data: "data=" + JSON.stringify(user),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
                        .then(function (data) {
                            // success
                            var parsedData = angular.fromJson(data);

                            // Save the data in the service
                            if (parsedData.data.IsSuccess)
                            {
                                user.UserID = parsedData.data.UserID;

                                saveUserDetailsCallback(user);
                            }

                            // Let the controller handle the response
                            return parsedData.data;
                        });

      
    };

    // TODO - Remove this
    this.getAllUsers = function () {

        return $http({
            url: "http://" + IP + "/GetUsersList",
            method: "GET",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (data) {
                // success
                var parsedData = angular.fromJson(data);

                // Let the controller handle the response
                return parsedData.data;
            });
    };
})