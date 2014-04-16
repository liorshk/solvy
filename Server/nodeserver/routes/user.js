
exports.UserModule = function(db)
{
    var User = db.Node.registerModel( 'User', { 
		fields: {
			indexes: {
			email: true
			},
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
			}
		}
		})


     /*
     * POST to adduser.
     */
    this.AddUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

		var data = req.params;
		if(req.method == "POST")
		{
		    data = JSON.parse(req.body.data);
		}
		var user = new User(data);

        try {
            user.save(function(err, result) {
                res.send({IsSuccess:true, UserID:result.id});
                console.log('Success to add user');
                });

        } catch (err) 
        {
            console.log('Failed to add user: ' + err);
            res.json({IsSuccess:false, Error:'Failed to register user'});
        }
	}
        
    /*
    * POST to LogIn.
    */
    this.LogIn = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        console.log(req.body);
        var data = JSON.parse(req.body.data);
        try 
        { 
            db.Node.findOne({ email: data.email }, function (err, dave) {
            if (err)
            {
                console.error('Error with user login: ' + err);
                res.json(false);                
                return ;
            }
            else
            {
                if (dave != null && dave.data.password == data.password)
                {
                    console.log('User & Password Matched');
                    res.json(true);
                    return ;
                }
                else
                {
                    console.log('User & Password Unmatched');
                    res.json(false);
                }
            }
        })
        }
        catch (err2)
        {
            console.log('Error with user login: ' + err2);
            res.json(false);
        }
    };


         /*
     * POST to adduser.
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
        
    /*
     * GET userlist page.
     */		  
    this.GetUserslist = function(req, res) {
  
	    var users = [];
	
        db.Graph
        .start()
        .match('(n:User)')
	    .return('(n)')
	    .exec(function(err, found){
		    if(found != null)
		    {
			    found.forEach(function(entry) {
				    users.push(entry.data);
			    });
		    }
		    res.json(users);
        });
	
      };



    this.authenticateUser = function(req, res){
            db.Node.findOne( { email: req.body.user }, function(err, dave) {
                try 
                {   
                 if (err)
                    {
                        console.error(err.message);                        
                    }
                    else
                    {
                        if (dave != null && dave.data.password == req.body.password )
                        {
                            console.log('User & Password Matched');
                              res.json(true);
                        }
                        else
                        {
                            res.json({msg:true});
                        }
                    }
                }
                catch(err2)
                {
                    res.json(err2.msg);
                }
            });
    };
    //--------------------------

    /*
     * DELETE all.
     */

    this.deleteall = function(req, res) {
        db.Graph
        .start()
        .match('(n:User)')
	    .delete('(n)')
	    .exec(function(err, found){res.json('');});
      }

}