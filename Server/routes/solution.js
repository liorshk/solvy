
exports.SolutionModule = function(db, fs, utils)
{      
        
    var Relationship_Solution_Question = "Belongs";
    var Relationship_Solution_User = "Answer";
    
    var fileUploader = new utils.fileUploader();

    var Solution = db.Node.registerModel('Solution', { 
		fields: {
            indexes: {
            solution_id: true
			},
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
                          , 
            solution_id: function()  {
                	return guid();
            }
            ,
            rating: 0
			}
		}
		})
    
    
    /*
     * POST to AnswerQuestion.
     */
    this.AnswerQuestion = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        var data = req.params;
        if (req.method == "POST") {
            data = req.body;
        }
        
        if (data.data != undefined) {
            data = JSON.parse(data.data);
        }
        
        var file = req.files.file,
            filePath = file.path;
        
        var fileName = utils.guid();
        
        fileUploader.upload(filePath, fileName, function (result) {
            if (result != null) {
                var imagePath = result.url;
                var userId = data.userId;
                var questionId = data.questionId;
                var qData = { imagePath: imagePath, title: data.title, details: data.details };
                
                try {
                    var solution = new Solution(qData);
                    
                    solution.save(function (err, resultAdd) {

                        if (resultAdd == null) {
                            console.log('Failed to add solution - No Result');
                            res.json({ IsSuccess: false, Error: 'Failed to add solution' });
                            return;
                        }

                        db.Graph.query(
                               "match (q:Question) match (u:User) match (s:Solution) " +
                               "where q.question_id = '" + data.questionId + "'" +
                                      "AND u.user_id='" + data.userId + "' "+
                                      "AND s.solution_id ='"+ resultAdd.data.solution_id +"' "+
                                      "merge (u-[answer:" + Relationship_Solution_User + "]->s-[belongs:" + Relationship_Solution_Question + "]->q) return s"
                        , function (err, result) {

                            if (result == null) {                                
                                console.log('Failed to add solution - No Result');
                                res.json({ IsSuccess: false, Error: 'Failed to add solution' });
                                return;
                            }
                            
                            res.send({ IsSuccess: true, SolutionID: resultAdd.data.solution_id });
                            console.log('Success to add solution');

                        });
                    });

                } catch (err) {
                    console.log('Failed to add solution: ' + err);
                    res.json({ IsSuccess: false, Error: 'Failed to add solution' });
                }
            }
            else {
                console.log('Failed to add image solution');
                res.json({ IsSuccess: false, Error: 'Failed to add image solution' });
            }
        });
		
    }
    

     /*
     * POST to AskSolution.
     */
  //  this.AddAnswerToQuestion = function (req, res) {
  //      res.header('Access-Control-Allow-Origin', "*");
		//var data = req.params;
		//if(req.method == "POST")
		//{
		//    data = req.body;
		//}
		//var imagePath = SaveImageInStorage(req);
		//if (imagePath != null)
  //      {
  //          data.imagePath = imagePath;
  //          var solution = new Solution(data);

  //          try {
  //              solution.save(function(err, result) {
  //                  res.send({IsSuccess:true, SolutionID:result.data.solution_id});
  //                  console.log('Success to add solution');
  //                  });

  //          } catch (err) 
  //          {
  //              console.log('Failed to add solution: ' + err);
  //              res.json({IsSuccess:false, Error:'Failed to add solution'});
  //          }
  //      }
  //      else
  //      {
  //          console.log('Failed to add image solution');
  //          res.json({IsSuccess:false, Error:'Failed to add image solution'});
  //      }
  //  }

    function SaveImageInStorage(req) {
        var file = req.files.file,
            filePath = file.path;
        var newPath = 'uploads/' + guid() + ".jpg";
        fs.rename(filePath, newPath, function (err) {
            if (err) throw err;
            console.log(newPath);
        });
        return newPath;
    }
        
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }


            
    /*
     * GET solutions list.
     */		  
    this.GetAllSolutionForQuestion = function(req, res) {
        res.header('Access-Control-Allow-Origin', "*");
	    var solutions = [];
	
        db.Graph
        .start()
        .match('(n:Solution)')
        .where({ 'n.questionId': req.params.questionId }) 
	    .return('(n)')
	    .exec(function(err, found){
		    if(found != null)
		    {
			    found.forEach(function(entry) {
				    solutions.push(entry.data);
			    });
		    }
		    res.json(solutions);
        });
	
      };
}