
exports.UserModule = function(db)
{
    var User = db.Node.registerModel( 'User', { 
		fields: {
			indexes: {
            user_id: true,
			email: true
			},
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
                            , 
            user_id: function()  {
                	return guid();
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
		    //data = req.body;
            data = JSON.parse(req.body.data);
		}
		var user = new User(data);

        try {
            user.save(function(err, result) {
                res.send({IsSuccess:true, UserID:result.data.user_id});
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

        var data = JSON.parse(req.body.data);

        try 
        { 
            var users = [];
            db.Graph
            .start()
            .match('(n:User)')
            .where({ 'n.username': data.username })
	        .return('(n)')
	        .limit(1, function(err, resUser){            
            if (err)
            {
                console.error('Error with user login: ' + err);
                res.json({ IsSuccess: false });
                return ;
            }
            else
            {
                if (resUser != null && resUser.data.password == data.password)
                {
                    console.log('User & Password Matched');
                    res.json({ IsSuccess: true, UserID: resUser.data.user_id });
                    return ;
                }
                else
                {
                    console.log('User & Password Unmatched');
                    res.json({ IsSuccess: false });
                }
            }
        })
        }
        catch (err2)
        {
            console.log('Error with user login: ' + err2);
            res.json({ IsSuccess: false });
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
                res.json({ IsSuccess: true });
                });

        } catch (err) 
        {
            console.log('Failed to add user: ' + err);
            res.json({ IsSuccess: false });
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

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }
}