﻿
exports.TagModule = function(db)
{
    var Tag = db.Node.registerModel( 'Tag', { 
		fields: {
			indexes: {
			name: true
			},
			defaults: {
			created_on: function()  {
				return new Date().getTime();
			}
			}
		}
		})


    /*
    * POST to SetTagToUser.
    */
    this.SetTagToUser = function (req, res) {
        res.header('Access-Control-Allow-Origin', "*");

        //var data = JSON.parse(req.body.data);
        var data = req.body;
        try 
        {
            // Check if the tag exist.
            var users = [];
            db.Graph
            .start()
            .match('(n:Tag)')
            .where({ 'n.name': data.name })
	        .return('(n)')
	        .limit(1, function(err, tag){            
                if (IsErrorOccuer(err, res, 'Failed to search tag')) return;
                else // Success the operation.
                {
                    if (tag == null) // If tag not found, create the tag.
                    {
                       tag = new Tag({name: data.name, rating: 0});
                       try {
                            tag.save(function(err, result) {
                                if (IsErrorOccuer(err, res, 'Failed to save new tag')) 
                                    return;
                            });
                        } 
                        catch (err) {
                            if (IsErrorOccuer(err, res, 'Failed to save new tag')) return;
                        }
                    }

                    if (!CreateRelationUserTag(data.userId, tag, res)) // If failed  
                        return ;
                }
            })
        }
        catch (err2)
        {
            if (IsErrorOccuer(err2, res, 'Failed to add tag for user')) return;
        }
        res.json({IsSuccess:true});  
    };

    function IsErrorOccuer(err, res, errorMessage)
    {
           if (err)
            {
                console.error(errorMessage + ': ' + err);
                res.json({IsSuccess:false});           
                return true;
            }
            return false;
    }

    // return true if success.
    function CreateRelationUserTag(userId, tag, res)
    {
        var x = db.Node.findById(parseInt(userId, 10));
        db.Graph
            .start()
            .match('(n:User)')
            .where({ 'n.user_id': userId })
	        .return('(n)')
	        .limit(1, function(err, user){            
                if (IsErrorOccuer(err, res, 'Failed when try to update tag rating')) return false;
                else
                {
                    user.createRelationTo(tag, 'folowing',function(err, dave){  
                    if (IsErrorOccuer(err, res, 'Failed when try to update tag rating')) return false;
                    else
                        return true;});
                }}
            );
    }



     /*
     * POST to AskQuestion.
     */
    //this.SetTagToUser = function(req, res) {		
	//	var data = req.params;
	//	if(req.method == "POST")
	//	{
	//		data = req.body;
	//	}
	//	var tag = new Tag(data);

    //    try {
    //         db.Node.findOrCreate( {
    //            name: 'Dave Grohl'
    //          }, cb );



    //        user.save(function(err, result) {
    //            res.json(true);
    //            });

    //    } catch (err) 
    //    {
    //        console.log('Failed to add user: ' + err);
    //        res.json(false);
    //    }
	//}
        
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