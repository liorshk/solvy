exports.TagModule = function(db, utils)
{

    var Relationship_Tag_User = "Subscribe";
    var Relationship_Tag_Question = "Belongs";


    /*
    * POST to UpsertTag.
     * Input: {name:string, icon:string,type: university/course/topic}
     * Return:  {IsSuccess: bool,TagID: guid}    
    */
    this.UpsertTag = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

        var data = JSON.parse(req.body.data);
        
        data.id = utils.guid();

        db.Graph.query("merge (tag:Tag {name: \"" + data.name + "\"}) " +
                        "set tag = " + utils.cleanQuery(data) + " "+
                        "return tag", 
                        function (err, tag) {
                            utils.isError(err, res, 'Failed to perform query to upsert tag');
                            if (tag != null && tag.data.length == 1) {
                                res.json({ IsSuccess: true, TagID: tag.data[0][0].data.id});
                            }
                            else {
                                res.json({ IsSuccess: false });
                            }
                        });

    };

    /*
    * POST to SetTagsToUser.
     * Input: {"userId":guid,"tags":array of string}
     * Return:  {IsSuccess: bool}    
    */
    this.SetTagsToUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        
        var data = JSON.parse(req.body.data);

        console.log("UserId: " + data.userId + " Tags: " + data.tags);

        //var data = req.body;
        try {
            for (index in data.tags) {
                db.Graph.query(utils.getMergeAndRelationshipQuery("User", { user_id: data.userId }, Relationship_Tag_User,"Tag", { name: data.tags[index] }), 
                    function (err, relation) {
                        utils.isError(err, res, 'Failed to perform query to set tag to user');
                        if (relation != null && relation.data.length > 0) {
                            res.json({ IsSuccess: true });
                        }
                        else {
                            res.json({ IsSuccess: false });
                        }
                    });
            }
        }
        catch (err)
        {
            utils.isError(err, res, 'Failed to add tag for user');
            res.json({ IsSuccess: false });
        }
    };

    /*
    * POST to SetTagsToQuestion.
     * Input: {"questionId":guid,"tags":array of string}
     * Return:  {IsSuccess: bool}   
    */
    this.SetTagsToQuestion = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

        var data = JSON.parse(req.body.data);
        
        console.log("QuestionId: " + data.questionId + " Tags: " + data.tags);

        //var data = req.body;
        try {
            for (index in data.tags) {
                db.Graph.query(utils.getMergeAndRelationshipQuery("Question", { question_id: data.questionId }, Relationship_Tag_Question, "Tag" ,{ name: data.tags[index] }),
                    function (err, relation) {
                        utils.isError(err, res, 'Failed to perform query to set tag to question');
                        if (relation != null && relation.data.length > 0) {
                            res.json({ IsSuccess: true });
                        }
                        else {
                            res.json({ IsSuccess: false });
                        }
                    });
            }
        }
        catch (err) {
            utils.isError(err, res, 'Failed to add tag for question');
            res.json({ IsSuccess: false });
        }
    };


     /*
     * GET GetTagsStartWith
     * Input: {"tagName":string}
     * Return:  array of string(tags)
     */		  
    this.GetTagsStartWith = function(req, res) {
        try
         {
             db.Graph
            .request()
            .query("MATCH (t:Tag) MATCH t.name =~ " + req.params.tagName + "*" + "RETURN t;", function (err, found){
                if (!err) {
                    var tags = [];
                    if (found != null) {
                        found.forEach(function (entry) {
                            tags.push(entry.data);
                        });
                    }
                    res.json(tags);
                }
                else {
                    utils.isError(err, res, 'Failed to perform GetTagsStartWith');
                }
            });
         }
        catch (err) {
            if (utils.isError(err, res, 'Failed to perform GetTagsStartWith')) return;
        }
	
    };

    /*
    * GET GetTagsForUser
     * Input: {"userId":guid}
     * Return:  array of string(tags)
    */
    this.GetTagsForUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var tags = [];

        try {
            db.Graph
           .request()
            .query("MATCH (tag:Tag)<-[S:" + Relationship_Tag_User + "]-(user:User { user_id: '" + req.params.userId + "'}) RETURN tag;", function (err, found) {
               if (found != null) {
                   found.data.forEach(function (entry) {
                       entry.forEach(function (ent) {
                           tags.push(ent.data);
                       });
                   });
               }
               res.json(tags);
           });
        }
        catch (err) {
            if (utils.isError(err, res, 'Failed to get tags for user')) return;
        }

    };

}