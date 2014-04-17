
exports.SolutionModule = function(db, fs)
{
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
     * POST to AskSolution.
     */
    this.AddAnswerToQuestion = function (req, res) {

		var data = req.params;
		if(req.method == "POST")
		{
		    data = req.body;
		}
		var imagePath = SaveImageInStorage(req);
		if (imagePath != null)
        {
            data.imagePath = imagePath;
            var solution = new Solution(data);

            try {
                solution.save(function(err, result) {
                    res.send({IsSuccess:true, SolutionID:result.data.solution_id});
                    console.log('Success to add solution');
                    });

            } catch (err) 
            {
                console.log('Failed to add solution: ' + err);
                res.json({IsSuccess:false, Error:'Failed to add solution'});
            }
        }
        else
        {
            console.log('Failed to add image solution');
            res.json({IsSuccess:false, Error:'Failed to add image solution'});
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