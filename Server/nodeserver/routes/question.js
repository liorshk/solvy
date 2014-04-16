
exports.QuestionModule = function(db)
{
    var question = db.Node.registerModel( 'Question', { 
		fields: {
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
			}
		}
		})

     /*
     * POST to AskQuestion.
     */
    this.AskQuestion = function(req, res) {		
		var data = req.params;
		if(req.method == "POST")
		{
			data = req.body;
		}
		var user = new User(data);

        try {
            user.save(function(err, result) {
                res.json(true);
                });

        } catch (err) 
        {
            console.log('Failed to add user: ' + err);
            res.json(false);
        }
	}
        
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