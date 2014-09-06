
/*
 * GET userlist page.
 */		  
exports.userlist = function(db) {
  return function(req, res) {
  
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
	
  }
};

/*
 * POST to adduser.
 */

exports.adduser = function(db) {
  return function(req, res) {
		var User = db.Node.registerModel( 'User', { 
			fields: {
			  indexes: {
				email: true
			  },
			  defaults: {
				created_on: function() {
				  return new Date().getTime();
				}
			  }
			}
		  });
		
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
};

//------------------
exports.authenticateUser = function(db) {
	return function(req, res){
        db.Node.findOne( { email: req.body.email}, function(err, dave) {
            try 
            {   
             if (err)
                {
                    console.error(err.message);
                    return err;
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
                        var response;
                        response.message = "try again";
                        res.json(false);
                    }
                }
            }
            catch(err)
            {
                res.json(err);
            }
        });
}
};
//--------------------------

/*
 * DELETE all.
 */

exports.deleteall = function(db) {
  return function(req, res) {
    db.Graph
    .start()
    .match('(n:User)')
	.delete('(n)')
	.exec(function(err, found){res.json('');});
  }
};


var x;
if (true)
    x.blabla = true;
else
    x = 5;

return x;
