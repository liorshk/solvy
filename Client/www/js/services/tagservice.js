services.factory('TagsService', function ($http, $window, IP) {
        
    return {
            
        getTags: function () {
            return $http({
                url: "http://" + IP + "/GetTags",
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(function (data, status, headers, config) {
                    return angular.fromJson(data).data;
                });
        },

        getTagsForUser: function (userId) {
            return $http({
                url: "http://" + IP + "/GetTagsForUser/" + userId,
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                    .then(function (data) {
                        return angular.fromJson(data).data;
                    })
                
        },

        setTagsToUser: function (userId, tags) {
            return $http({
                url: "http://" + IP + "/SetTagsToUser/",
                method: "POST",
                data: "data=" + JSON.stringify({ userId: userId,tags: tags }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(function (data) {
                return angular.fromJson(data).data;
            })

        },
        setTagsToQuestion: function (questionId, tags) {
            return $http({
                url: "http://" + IP + "/SetTagsToQuestion/",
                method: "POST",
                data: "data=" + JSON.stringify({ questionId: questionId,tags: tags }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(function (data) {
                return angular.fromJson(data).data;
            })

        },

        addTag: function (tag) {
            return $http({
                url: "http://" + IP + "/addTag",
                method: "POST",
                data: "data=" + JSON.stringify(tag),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                 .success(function (data, status, headers, config) {
                     // success
                     return angular.fromJson(data).data;
                 });
        }
    }
});