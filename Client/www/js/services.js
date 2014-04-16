angular.module('starter.services', [])

    .factory('UserService', function ($http) {

        var user = {};

        return {
            fillDetails: function (username, password, email) {
                user.username = username;
                user.password = password;
                user.email = email;
            },
            fillTags: function (tags) {
                user.tags = tags
            },

            register: function () {
                $http({
                    url: 'http://localhost/AddUser',
                    method: "POST",
                    data: user,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (response) {
                    
                    // success
                    if (response) {
                        $state.go('login');
                    }
                })
                .error(function (response) { // optional
                        // failed
                        $scope.errormessage = 'Error';
                    }
                );
            },

            login: function(user)
            {
                    $http
                    .post('http://localhost/login', user)
                    .success(function (data, status, headers, config) {
                        //$window.sessionStorage.token = data.token;
                        $state.go('tabs.home');
                    })
                    .error(function (data, status, headers, config) {
                        // Erase the token if the user fails to log in
                        //delete $window.sessionStorage.token;

                        // Handle login errors here
                        $scope.errormessage = 'Error: Invalid user or password';
                    });
            }
        }
    })

	
	.factory('Tags', function($q) {

	  var tags = [
		{ id: 0, type: C, name: 'Calculus' },
		{ id: 1, type: C, name: 'Linear' },
		{ id: 2, type: C, name: 'Python' },
		{ id: 3, type: U, name: 'Tel Aviv University' }
	  ];

	  return {
		all: function(type) {
			var deferred = $q.defer(),
			results = tags.filter(function (tag) {
				return tag.type == type;
			});
			deferred.resolve(results);
			
			return deferred;
		}
	  }
	});