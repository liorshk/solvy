
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
            //data = JSON.parse(req.body.data);
		}

        if (imagePath = SaveImageInStorage(req) != null)
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

    // return the image path if success else null.
    function SaveImageInStorage(req) {
        console.log(req.files);
        // get the temporary location of the file
        var tmp_path = req.files.thumbnail.path;
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = './uploads/' + guid() + ".jpg";
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                console.log('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
            });
        });

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