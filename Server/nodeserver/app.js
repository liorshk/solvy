
/**
 * Module dependencies.
 */
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var routes = require('./routes');
var user = require('./routes/user')
var question = require('./routes/question')
var tag = require('./routes/tag')
var http = require('http');
var path = require('path');
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

// Database
var Neo4jMapper = require('neo4jmapper');
var neo4j = new Neo4jMapper('http://54.72.160.154:7474/');

user = new user.UserModule(neo4j);
question = new question.QuestionModule(neo4j);
tag = new tag.TagModule(neo4j);

var app = express();

// all environments
app.set('port', 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'admin')));	// set the static files location
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 					// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

app.get('/', routes.index);


// ----------------------------------------Methods To implements.--------------------------------------------
app.post('/AddUser', user.AddUser); // return ture if success else false   | {"username":"Check Maor","email":"asdasdasdasd","password":"123123"}
app.post('/LogIn', user.LogIn); // return ture if success else false       | {"email":"asdasdasdasd","password":"123123"}
app.post('/SetTagToUser', tag.SetTagToUser); //                            | {"name":"KingTad","userId":"2a207069-1776-995f-5bf1-f77cbf5624c3"}
//app.get('/GetTagsStartWith', user.GetTagsStartWith);
//app.post('/AskQuestion', question.AskQuestion);
//app.post('/AddAnswerToQuestion', user.userlist);
//app.get('/GetQuestions', user.userlist);
//app.get('/GetQuestionWithSolutions', user.userlist);
//app.get('/GetUserDetails', user.userlist);
//app.post('/EditDetails', user.userlist);
//app.get('/GetQuestionWithSolutions', user.userlist);
//app.get('/GetUserRating', user.userlist);
//app.get('/GetTopUsersRating', user.userlist);
//app.get('/GetRelevantTopUsersRating', user.userlist);


// ----------------------------------------Methods For Debug.--------------------------------------------
app.get('/GetUsersList', user.GetUserslist);
app.delete('/deleteall/', user.deleteall);
//app.get('/adduser/:username/:password/:email?', user.adduser);
app.post('/login', user.authenticateUser);






// development only
if ('development' == app.get('env')) {
  //app.use(express.errorhandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
