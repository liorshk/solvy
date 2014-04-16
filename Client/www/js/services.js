angular.module('starter.services', [])

	.factory('UserService', function() {
	 
		var user = {};

		return {
			fillDetails: function(username,password,email) {
				user.username = username;
				user.password = password;
				user.email = email;
			},
			fillTags: function(tags) {
				user.tags = tags
			},
			
			register: function()
			{
				
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