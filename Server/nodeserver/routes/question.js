
exports.QuestionModule = function(db)
{
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
                	return guid();
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
		if(req.method == "POST")
		{
		    data = req.body;
            //data = JSON.parse(req.body.data);
		}
		var question = new Question(data);

        try {
            question.save(function(err, result) {
                res.send({IsSuccess:true, QuestionID:result.data.question_id});
                console.log('Success to add question');
                });

        } catch (err) 
        {
            console.log('Failed to add question: ' + err);
            res.json({IsSuccess:false, Error:'Failed to add question'});
        }
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
     * GET questions list.
     */		  
    this.GetQuestions = function(req, res) {
  
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