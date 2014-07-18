
exports.TagModule = function(db)
{
    var Tag = db.Node.registerModel( 'Tag', { 
		fields: {
			indexes: {
			name: true
			},
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
			}
		}
		})


    /*
    * POST to SetTagToUser.
    */
    this.SetTagToUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

        var data = JSON.parse(req.body.data);
        //var data = req.body;
        try 
        {
            // Check if the tag exist.
            var users = [];
            db.Graph.query("MATCH (user:User { user_id: '" + data.userId + "' }) MERGE (user)" +
                                    "-[r:Subscribe]->(tag:Tag { name:'"+ data.tagName +"' }) RETURN r",
                function (err, relation) {
                    IsError(err, res, 'Failed to perform query to set tag to user');
                    if (relation != null && relation.data.length > 0) {
                        res.json({ IsSuccess: true });
                    }
                    else {
                        res.json({ IsSuccess: false });
                    }
                });
        }
        catch (err)
        {
            IsError(err, res, 'Failed to add tag for user');
            res.json({ IsSuccess: false });
        }
    };

    function IsError(err, res, errorMessage)
    {
           if (err)
            {
                console.error(errorMessage + ': ' + err);
                res.json({IsSuccess:false});           
                return true;
            }
            return false;
    }


    /*
    * POST to SetTagToQuestion.
    */
    this.SetTagToQuestion = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

        //var data = JSON.parse(req.body.data);
        var data = req.body;
        try 
        {
            // Check if the tag exist.
            var users = [];
            db.Graph
            .start()
            .match('(n:Tag)')
            .where({ 'n.name': data.tagName })
	        .return('(n)')
	        .limit(1, function(err, tag){            
	            if (IsError(err, res, 'Failed to search tag')) return;
                else // Success the operation.
                {
                    if (tag == null) // If tag not found, create the tag.
                    {
                       tag = new Tag({name: data.tagName, rating: 0});
                       try {
                            tag.save(function(err, result) {
                                if (IsError(err, res, 'Failed to save new tag'))
                                    return;
                            });
                        } 
                        catch (err) {
                            if (IsError(err, res, 'Failed to save new tag')) return;
                        }
                    }

                    if (!CreateRelationQuestionTag(data.questionId, tag, res)) // If failed  
                        return ;
                }
            })
        }
        catch (err2)
        {
            if (IsError(err2, res, 'Failed to add tag for user')) return;
        }
        res.json({IsSuccess:true});  
    };

    // return true if success.
    function CreateRelationQuestionTag(questionId, tag, res)
    {
        //var x = db.Node.findById(parseInt(questionId, 10));
        db.Graph
            .start()
            .match('(n:Question)')
            .where({ 'n.question_id': questionId })
	        .return('(n)')
	        .limit(1, function(err, question){            
	            if (IsError(err, res, 'Failed to create tag question relation')) return false;
                else
                {
                    question.createRelationTo(tag, 'question_type',function(err, dave){  
                        if (IsError(err, res, 'Failed to create tag question relation')) return false;
                    else
                        return true;});
                }}
            );
    }

     /*
     * GET GetTagsStartWith
     */		  
    this.GetTagsStartWith = function(req, res) {
        try
         {
             db.Graph
            .request()
            .query("MATCH (t:Tag) MATCH t.name =~ " + req.params.tagName + "*" + "RETURN t;", function(err, found){
		        if(found != null)
		        {
			        found.forEach(function(entry) {
				        users.push(entry.data);
			        });
		        }
		        res.json(found);
            });
         }
        catch (err) {

        }
	
    };

    /*
    * GET GetTagsForUser
    */
    this.GetTagsForUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var tags = [];

        try {
            db.Graph
           .request()
            .query("MATCH (tag:Tag)<-[S:Subscribe]-(user:User { user_id: '" + req.params.userId + "'}) RETURN tag;", function (err, found) {
               if (found != null) {
                   found.data.forEach(function (entry) {
                       entry.forEach(function (ent) {
                           tags.push(ent.data.name);
                       });
                   });
               }
               res.json(tags);
           });
        }
        catch (err) {
            if (IsError(err, res, 'Failed to get tags for user')) return;
        }

    };

     /*
     * POST to AskQuestion.
     */
    //this.SetTagToUser = function(req, res) {		
	//	var data = req.params;
	//	if(req.method == "POST")
	//	{
	//		data = req.body;
	//	}
	//	var tag = new Tag(data);

    //    try {
    //         db.Node.findOrCreate( {
    //            name: 'Dave Grohl'
    //          }, cb );



    //        user.save(function(err, result) {
    //            res.json(true);
    //            });

    //    } catch (err) 
    //    {
    //        console.log('Failed to add user: ' + err);
    //        res.json(false);
    //    }
	//}
        
    ///*
    //* POST to LogIn.
    //*/
    //this.LogIn = function(req, res) {		
    //    try 
    //    { 
    //        db.Node.findOne( { email: req.body.email }, function(err, dave) {                
    //        if (err)
    //        {
    //            console.error('Error with user login: ' + err);
    //            res.json(false);                
    //            return ;
    //        }
    //        else
    //        {
    //            if (dave != null && dave.data.password == req.body.password)
    //            {
    //                console.log('User & Password Matched');
    //                res.json(true);
    //                return ;
    //            }
    //            else
    //            {
    //                console.log('User & Password Unmatched');
    //                res.json(false);
    //            }
    //        }
    //    })
    //    }
    //    catch (err2)
    //    {
    //        console.log('Error with user login: ' + err2);
    //        res.json(false);
    //    }
    //};

}