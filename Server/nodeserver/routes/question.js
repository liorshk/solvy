
exports.QuestionModule = function(db, fs)
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
		}
		var imagePath = SaveImageInStorage(req);
		if (imagePath != null)
        {
            data.imagePath = imagePath;
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
        else
        {
            console.log('Failed to add image question');
            res.json({IsSuccess:false, Error:'Failed to add image question'});
        }
    }

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