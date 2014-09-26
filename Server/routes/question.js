exports.QuestionModule = function(db, fs, utils)
{
    var Relationship_Question_User = "Ask";    
    var Relationship_Tag_User = "Subscribe";
    var Relationship_Tag_Question = "Belongs";    
    var Relationship_Favorite_Question_User = "Favorite";

    var Question = db.Node.registerModel('Question', { 
		fields: {
            indexes: {
            question_id: true
			},
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
                          , 
            question_id: function()  {
                	return utils.guid();
            }
			}
		}
		})

     /*
     * POST to AskQuestion.
     */
    this.AskQuestion = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }
        
        if (data.data != undefined) {
            data = JSON.parse(data.data);
        }
    
		var imagePath = SaveImageInStorage(req);
		if (imagePath != null)
        {                        
            var userId = data.UserId;
            var qData = { imagePath: imagePath, title: data.title, details: data.details };  
            
            try {
                var question = new Question(qData);
                
                question.save(function (err, resultAdd) {
                    db.Graph.query(utils.getMergeAndRelationshipQuery("User", { user_id: userId }, Relationship_Question_User, "Question", { question_id: resultAdd.data.question_id })
                        , function (err, result) {
                                    res.send({ IsSuccess: true, QuestionID: resultAdd.data.question_id });
                                    console.log('Success to add question');
                                });
                });                

            } catch (err) 
            {
                console.log('Failed to add question: ' + err);
                res.json({IsSuccess:false, Error:'Failed to add question'});
            }
        }
        else
        {
            console.log('Failed to add image question');
            res.json({IsSuccess:false, Error:'Failed to add image question'});
        }
    }

    function SaveImageInStorage(req) {
        var file = req.files.file,
            filePath = file.path;
        // TODO - change the ip
        //var os = require('os');
        //var ifaces = os.networkInterfaces();
        //var address;
        //for (var dev in ifaces) {
        //    var alias = 0;
        //    ifaces[dev].forEach(function (details) {
        //        if (details.family == 'IPv4' && details.address != "127.0.0.1") {
        //            address = details.address;
        //        }
        //    });
        //}
        var address = "54.72.160.154";

        var address = "http://" + address + "/";
        var imageName = utils.guid() + ".jpg";
        var newPath = 'uploads/' + imageName;
        fs.rename(filePath, newPath, function (err) {
            if (err) throw err;
            console.log(newPath);
        });
        return address + imageName;
    }

    /*
     * POST to SetQuestionFavorite.
     * Input: {questionId:guid, userId:guid}
     * Return:  {IsSuccess: bool}    
     */
    this.SetQuestionFavorite = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }
        if (data.data != undefined) {
            data = JSON.parse(data.data);
        }
        db.Graph
            .query(
                "match (q:Question) match (u:User) where q.question_id = '"+data.questionId+"'"+
                                                        "AND u.user_id='" + data.userId + "' merge (u-[f:"+ Relationship_Favorite_Question_User+"]->q) return f", 
                function (err, result) {
            
                    var questions = [];
            
                    if (result != null) {
                
                        res.json({ IsSuccess: true });
                
                        console.log('Success to make question "' + data.questionId + 'favorited by user ' + data.userId);
                    }
                    else {
                        res.json({ IsSuccess: false });
                    }
            });
    }
    

    /*
     * GET questions for a user and a tag
     */		  
    this.GetQuestionsForTagAndUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }

        db.Graph
        .query(
        "match (user:User)-[a:" + Relationship_Question_User + "]->(q:Question)-[b:" + Relationship_Tag_Question + "]->(tag:Tag)" +
        " where user.user_id = '" + data.userId + "' AND tag.name = '" + data.tagName + "' return q ", 
            function (err, result) {
            
            var questions = [];

            if (result != null) {
                result.data.forEach(function (entry) {
                    entry.forEach(function (ent) {
                        questions.push(ent.data);
                    });
                });
                
                res.json({ IsSuccess: true, Questions: questions });
                
                console.log('Success to retrieve questions for user and tag');
            }       
        });

	
    };
    
    /*
     * GET questions for a tag
     */		  
    this.GetQuestionsForTag = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }
        
        db.Graph
        .query(
        "match (q:Question)-[b:" + Relationship_Tag_Question + "]->(tag:Tag)" +
        " where tag.name = '" + data.tagName + "' return q ", 
            function (err, result) {
            
            if (err != null) {
                res.json({ IsSuccess: false });
                return;
            }
            var questions = [];
            
            if (result != null) {
                result.data.forEach(function (entry) {
                    entry.forEach(function (ent) {
                        questions.push(ent.data);
                    });
                });
                
                console.log('Returning ' + questions.length + ' Questions for tag: ' + data.tagName);
            }
            else {
                console.log("No questions found");
            }

            res.json({ IsSuccess: true, Questions: questions });
        });

	
    };

    /*
     * GET questions for a tag and adds isFavorite for the user
     */		  
    this.GetQuestionsForTagAndFavoriteForUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }
        
        db.Graph
        .query(
        "match (q:Question)-[b:" + Relationship_Tag_Question + "]->(tag:Tag)" +
        "optional match (user:User)-[f:"+ Relationship_Favorite_Question_User+"]->(q)" +
        " where tag.name = '" + data.tagName + "' and user.user_id = '"+data.userId + "' return q,f ", 
            function (err, result) {
            
            if (err != null) {
                res.json({ IsSuccess: false });
                return;
            }
            var questions = [];
            var favoriteQids = [];
            if (result != null) {
                result.data.forEach(function (entry) {
                    // TODO - Make it more efficient
                    entry.forEach(function (ent) {
                        if (ent.type == Relationship_Favorite_Question_User) {
                            favoriteQids[ent.to.id]=true;
                        }
                        else {
                            ent.data.id = ent.id;
                            questions.push(ent.data);
                        }
                    });
                });
                
                for(var i in questions){                    
                    if (favoriteQids[questions[i].id]) {
                        questions[i].isFavorite = true;
                    }
                };
                
                console.log('Returning ' + questions.length + ' Questions for tag: ' + data.tagName);
            }
            else {
                console.log("No questions found");
            }

            res.json({ IsSuccess: true, Questions: questions });
        });

	
    };
    
    /*
     * GET favorite questions for a user
     */		  
    this.GetFavoriteQuestionsForUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }
        
        db.Graph
        .query(
        "match (user:User)-[a:" + Relationship_Favorite_Question_User + "]->(q:Question)" +
        "where user.user_id = '" + data.userId + "' return q ", 
            function (err, result) {
            
            var questions = [];
            
            if (result != null) {
                result.data.forEach(function (entry) {
                    entry.forEach(function (ent) {
                        questions.push(ent.data);
                    });
                });
                
                res.json({ IsSuccess: true, Questions: questions });
                
                console.log('Success to retrieve questions for user and tag');
            }
        });
    }
         
    /*
     * GET questions list.
     */		  
    this.GetQuestions = function(req, res) {
        res.header('Access-Control-Allow-Origin', "*");
	    var questions = [];
	
        db.Graph
        .start()
        .match('(n:Question)')
	    .return('(n)')
	    .exec(function(err, found){
		    if(found != null)
		    {
			    found.forEach(function(entry) {
				    questions.push(entry.data);
			    });
		    }
		    res.json(questions);
        });
	
      };
}