
/**
 * Module dependencies.
 */
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var underscore = require('underscore');
var multipart = require('connect-multiparty');
var routes = require('./routes');
var user = require('./routes/user');
var question = require('./routes/question');
var solution = require('./routes/solution');
var tag = require('./routes/tag');
var utils = require('./components/utils.js');
var http = require('http');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

// Database
var Neo4jMapper = require('neo4jmapper');
var neo4j = new Neo4jMapper('http://localhost:7474/');

user = new user.UserModule(neo4j, utils);
question = new question.QuestionModule(neo4j, fs, utils, underscore);
tag = new tag.TagModule(neo4j, utils);
solution = new solution.SolutionModule(neo4j,fs, utils);

var app = express();

// Create the "uploads" folder if it doesn't exist
fs.exists(__dirname + '/uploads', function (exists) {
if (!exists) {
    console.log('Creating directory ' + __dirname + '/uploads');
    fs.mkdir(__dirname + '/uploads', function (err) {
        if (err) {
            console.log('Error creating ' + __dirname + '/uploads');
            process.exit(1);
        }
    })
}
});


// all environments
app.set('port', 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'admin')));	// set the static files location
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true,
    limit: 1024 * 1024 * 1024 * 10,
    defer: true
})); 					// pull information from html in POST
app.use(multipart());
app.use(methodOverride()); 					// simulate DELETE and PUT

app.get('/', routes.index);
app.use(express.static(path.join(__dirname, './uploads')));

// ----------------------------------------Methods To implements.--------------------------------------------
// Users
app.post('/AddUser', user.AddUser); // return {IsSuccess: bool, UserID: Guid }   | {"username":"Check Maor","email":"asdasdasdasd","password":"123123","university":string,"courses":array[string]}
app.post('/LogIn', user.LogIn); // return {IsSuccess: bool, UserID: Guid }       | {"email":"asdasdasdasd","password":"123123"}
app.post('/DeleteUser', user.DeleteUser); // return {IsSuccess: bool }           | {"userId": guid} // TODO -SECURE

// Tags
app.post('/UpsertTag', tag.UpsertTag); //    return {IsSuccess: bool, TagID: guid}      | {"name":string,"icon":string,"type": "university/course/topic"}
app.post('/SetTagsToUser', tag.SetTagsToUser); //    return {IsSuccess: bool}      | {"userId":guid,"tags":array of string}
app.post('/SetTagsToQuestion', tag.SetTagsToQuestion); //                          | {"questionId":guid,"tags":array of string}
app.get('/GetTagsStartWith/:tagName', tag.GetTagsStartWith);
app.get('/GetTagsForUser/:userId', tag.GetTagsForUser);
app.get('/GetTagsByType/:type', tag.GetTagsByType); // return {IsSuccess: bool, array of tags}} | type: "university/course/topic" 

// Questions
app.post('/AskQuestion', question.AskQuestion);     // return {IsSuccess: bool, QuestionID: Guid }    | {"file":"c:/asd/asd.image","title": "Title", "details":"bla bla image"}
app.post('/AnswerQuestion', solution.AnswerQuestion);   //  
app.post('/SetQuestionFavorite', question.SetQuestionFavorite);   // return {IsSuccess: bool}    | Input: {questionId: guid, userId:guid}
app.post('/UnfavoriteQuestion', question.UnfavoriteQuestion);   // return {IsSuccess: bool}    | Input: {questionId: guid, userId:guid}
app.get('/GetFavoriteQuestionsForUser/:userId', question.GetFavoriteQuestionsForUser); //  return {IsSuccess: bool, Questions: Array }    | {"userId":guid}
app.get('/GetQuestionsForTagAndUser/:tagName/:userId', question.GetQuestionsForTagAndUser); //  return {IsSuccess: bool, Questions: Array }    | {"userId":guid,"tag":string}
app.get('/GetQuestionsForTag/:tagName', question.GetQuestionsForTag); //  return {IsSuccess: bool, Questions: Array }    | {"tag":string}
app.get('/GetQuestionsForTagAndFavoriteForUser/:tagName/:userId', question.GetQuestionsForTagAndFavoriteForUser); //  return {IsSuccess: bool, Questions: Array (isFavorite) }    | {"userId":guid,"tag":string}
app.get('/GetAllSolutionForQuestion/:questionId', solution.GetAllSolutionForQuestion); // 
app.get('/GetQuestions', question.GetQuestions);           //              |

//app.get('/GetQuestionWithSolutions', user.userlist);
//app.get('/GetUserDetails', user.userlist);
//app.post('/EditDetails', user.userlist);
//app.get('/GetQuestionWithSolutions', user.userlist);
//app.get('/GetUserRating', user.userlist);
//app.get('/GetTopUsersRating', user.userlist);
//app.get('/GetRelevantTopUsersRating', user.userlist);


// ----------------------------------------Methods For Debug.--------------------------------------------
app.get('/GetUsersList', user.GetUsersList);
app.delete('/deleteall/', user.deleteall);
//app.get('/adduser/:username/:password/:email?', user.adduser);

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorhandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
