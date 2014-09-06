exports.UserModule = function(db, utils)
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
                	return utils.guid();
			}
		}
		}
		})


     /*
     * POST to adduser.
      * Adds the user data only
     */
    this.AddUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

		var data = req.params;
		if(req.method == "POST")
		{
		    //data = req.body;
            data = JSON.parse(req.body.data);
        }
        var dbData = { username: data.username, password: data.password, email: data.email };
		var user = new User(dbData);

        try {
            user.save(function (err, result) {
                if (!err) {
                    res.send({ IsSuccess: true, UserID: result.data.user_id });
                    
                    console.log('Success to add user');
                }
                else {
                    console.log('Failed to add user: ' + err);
                    res.json({ IsSuccess: false, Error: 'Failed to register user' });
                }
            });

        } catch (err) 
        {
            console.log('Failed to add user: ' + err);
            res.json({IsSuccess:false, Error:'Failed to register user'});
        }
    }
    
    /*
     * POST to DeleteUser.
     */
    this.DeleteUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");
        
        var data = req.params;
        if (req.method == "POST") {
            //data = req.body;
            data = JSON.parse(req.body.data);
        }        
        
        try {
            db.Graph
                .start()
                .match('(n:User { user_id:"' + data.user_id + '" })')
	            .delete('(n)')
	            .exec(function (err, found) {
                    if (err) {
                        console.log('Failed to delete user: ' + err);
                        res.json({ IsSuccess: true });
                    }
                    else {
                        res.json({ IsSuccess: false });
                    }
                });

        } catch (err) {
            console.log('Failed to delete user: ' + err);
            res.json({ IsSuccess: false});
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
    }
            
    /*
     * GET userlist page.
     */		  
    this.GetUsersList = function(req, res) {
        res.header('Access-Control-Allow-Origin', "*");

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

    
}