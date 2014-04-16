
/**
 * Module dependencies.
 */
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var routes = require('./routes');
var user = require('./routes/user')
var http = require('http');
var path = require('path');
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

// Database
var Neo4jMapper = require('neo4jmapper');
var neo4j = new Neo4jMapper('http://54.72.160.154:7474/');

user = new user.UserModule(neo4j);

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
app.get('/userlist', user.userlist);

//app.get('/adduser/:username/:password/:email?', user.adduser);
app.post('/login', user.authenticateUser);
app.delete('/deleteall/', user.deleteall);

// To Implemant.
app.post('/AddUser', user.AddUser);
//app.post('/LogIn', user.AddUser);
//app.post('/AskQuestion', user.AskQuestion);
//app.post('/AddAnswerToQuestion', user.userlist);
//app.get('/GetQuestions', user.userlist);
//app.get('/GetQuestionWithSolutions', user.userlist);
//app.get('/GetUserDetails', user.userlist);
//app.post('/EditDetails', user.userlist);
//app.get('/GetQuestionWithSolutions', user.userlist);
//app.get('/GetUserRating', user.userlist);
//app.get('/GetTopUsersRating', user.userlist);
//app.get('/GetRelevantTopUsersRating', user.userlist);


// development only
if ('development' == app.get('env')) {
  //app.use(express.errorhandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
