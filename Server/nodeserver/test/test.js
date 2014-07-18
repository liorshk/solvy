var should = require('should');
var assert = require('assert');
var request = require('supertest');

var user = require('../routes/user');
var question = require('../routes/question');
var solution = require('../routes/solution');
var tag = require('../routes/tag');
var fs = require('fs');



describe('Routing', function () {
    var url = 'localhost';
    
    var userModule;
    var questionModule;
    var tagModule;
    var solutionModule;
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        //// Database
        //var Neo4jMapper = require('neo4jmapper');
        //var neo4j = new Neo4jMapper('http://'+url+':7474/');

        //userModule = new user.UserModule(neo4j);
        //questionModule = new question.QuestionModule(neo4j, fs);
        //tagModule = new tag.TagModule(neo4j);
        //solutionModule = new solution.SolutionModule(neo4j, fs);
        done();
    });

    describe('User', function () {
        it.skip('Adding User', function (done) {

            var profile = { data: '{ "username": "user", "email": "email", "password": "pass" }' };

            request(url)
                .post('/AddUser')
                .send(profile)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    //{IsSuccess:true, UserID:result.data.user_id}
                    // Should.js fluent syntax applied
                    res.body.should.have.property('UserID');
                    res.body.IsSuccess.should.equal(true);
                    done();
                });
        });

        it('Fake Login', function (done) {

            var profile = { data: '{"username":"userasd","password":"pass"}' };

            request(url)
                .post('/Login')
                .send(profile)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // Should.js fluent syntax applied
                    res.body.IsSuccess.should.equal(false);
                    done();
                });
        });

        describe('User - After Login', function () {

            var profile = { data: '{"username":"user","password":"pass"}' };
            var UserId;

            it('Login', function (done) {

                var profile = { data: '{"username":"user","password":"pass"}' };

                request(url)
                    .post('/Login')
                    .send(profile)
                    .expect('Content-Type', /json/)
                    .expect(200) //Status code
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.IsSuccess.should.equal(true);
                        res.body.UserID.should.have.length(36);

                        UserId = res.body.UserID;
                        done();
                    });
            });

            it('Set Tag To User', function (done) {
                request(url)
                       .post('/SetTagToUser')
                       .send({ data: '{ "tagName": "tag2", "userId": "' + UserId + '" }' })
                       .expect('Content-Type', /json/)
                       .expect(200) //Status code
                       .end(function (err, res) {
                           if (err) {
                               throw err;
                           }
                           // Should.js fluent syntax applied
                           res.body.IsSuccess.should.equal(true);
                       });

                done();

            });

            it('Get Tags For User', function (done) {
                request(url)
                       .get('/GetTagsForUser/' + UserId)
                       .send()
                       .expect(200) //Status code
                       .end(function (err, res) {
                           if (err) {
                               throw err;
                           }
                           // Should.js fluent syntax applied
                           res.body.should.be.instanceof(Array)
                           res.body[0].should.equal('tag');
                       });

                done();

            });
        });
    });
});