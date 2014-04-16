
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
     * GET userlist page.
     */		  
    this.userlist = function(req, res) {
  
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

    /*
     * POST to adduser.
     */

    this.adduser = function(req, res) {		
		
		    var data = req.params;
		    if(req.method == "POST")
		    {
			    data = req.body;
		    }
		    var user = new User(data);

		    user.save(function(err, result) {

                    res.json('');
                
                    });

	    }
  

    //------------------
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