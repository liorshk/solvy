controllers.controller('TagsCtrl', function ($scope, $rootScope, $state, TagsService, UserService) {
	console.log('TagsCtrl');

	var curUserId = UserService.getCurrentUser().UserID;

	// Load Tags
	TagsService.getTagsForUser(curUserId)
		.then(function (tags) {
			$rootScope.tags = tags;
		});
})

	