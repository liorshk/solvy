angular.module('starter.services', [])

    .factory('UserService', function ($http,$rootScope, $state) {

        var user = {};

        return {
            fillDetails: function (username, password, email) {
                user.username = username;
                user.password = password;
                user.email = email;
            },
            fillTags: function (university,courses) {
                user.university = university;
                user.courses = courses;
            },

            register: function () {

                $http({
                    url: 'http://localhost/AddUser',
                    method: "POST",
                    data: "data=" +JSON.stringify(user),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    var parsedData = angular.fromJson(data);
                    // success
                    if (parsedData.IsSuccess) {
                        user.id = parsedData.UserID;
                        $state.go('tabs.home');
                    }
                })
                .error(function (data, status, headers, config) { // optional
                        // failed
                        $scope.errormessage = 'Error';
                    }
                );
            },

            login: function(user)
            {
                $http({
                    url: 'http://localhost/LogIn',
                    method: "POST",
                    data: "data=" + JSON.stringify(user),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {

                    // success
                    if (angular.fromJson(data)) {
                        $state.go('tabs.home');
                    }
                })
                .error(function (data, status, headers, config) { // optional
                    // failed
                    $scope.errormessage = 'Error';
                }
                );
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