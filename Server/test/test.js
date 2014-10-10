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
    
    describe.skip('InitLoad', function () {
        describe('Adding Universities', function () {
            it('Adding Jerusalem University', function (done) {
                request(url)
                .post('/UpsertTag')
                .send({ data: JSON.stringify({ name: "האוניברסיטה העברית", icon: "img/university_logos/hebrew_university_logo.jpg", type: "university" }) })
                .expect('Content-Type', /json/)
                .expect(200)//Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    
                    res.body.should.have.property('TagID');
                    res.body.IsSuccess.should.equal(true);
                    done();
                });
            });

            it('Adding Tel Aviv University', function (done) {
                request(url)
                .post('/UpsertTag')
                .send("data=" + JSON.stringify({ name: "אוניברסיטת תל אביב", icon: "img/university_logos/Tel_aviv_university_logo.png", type: "university" }))
                .expect('Content-Type', /json/)
                .expect(200)//Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    
                    res.body.should.have.property('TagID');
                    res.body.IsSuccess.should.equal(true);
                    done();
                });

            });

            it('Adding Bar Ilan University', function (done) {
                request(url)
                .post('/UpsertTag')
                .send("data=" + JSON.stringify({ name: "אוניברסיטת בר אילן", icon: "img/university_logos/Bar_Ilan_logo.png", type: "university" }))
                .expect('Content-Type', /json/)
                .expect(200)//Status code
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    
                    res.body.should.have.property('TagID');
                    res.body.IsSuccess.should.equal(true);
                    done();
                });
            });

           it('Adding Ariel University', function (done) {
                    request(url)
                .post('/UpsertTag')
                .send("data=" + JSON.stringify({ name: "אוניברסיטת אריאל", icon: "img/university_logos/Ariel_University_Logo.png", type: "university" }))
                .expect('Content-Type', /json/)
                .expect(200)//Status code
                .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        
                        res.body.should.have.property('TagID');
                        res.body.IsSuccess.should.equal(true);
                        done();
                    });
            });

            it('Adding Ben Gurion University', function (done) {
                        request(url)
                .post('/UpsertTag')
                .send("data=" + JSON.stringify({ name: "אוניברסיטת בן גוריון", icon: "img/university_logos/bgu_logo.png", type: "university" }))
                .expect('Content-Type', /json/)
                .expect(200)//Status code
                .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            
                            res.body.should.have.property('TagID');
                            res.body.IsSuccess.should.equal(true);
                            done();
                        });
            });
                    
            it('Adding Open University', function (done) {
                            request(url)
                .post('/UpsertTag')
                .send("data=" + JSON.stringify({ name: "האוניברסיטה הפתוחה", icon: "img/university_logos/Open_University_of_Israel_logo.png", type: "university" }))
                .expect('Content-Type', /json/)
                .expect(200)//Status code
                .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                
                                res.body.should.have.property('TagID');
                                res.body.IsSuccess.should.equal(true);
                                done();
                });
            });

            it('Adding Technion University', function (done) {
                                request(url)
                    .post('/UpsertTag')
                    .send("data=" + JSON.stringify({ name: "הטכניון", icon: "img/university_logos/Technion_logo.png", type: "university" }))
                    .expect('Content-Type', /json/)
                    .expect(200)//Status code
                    .end(function (err, res) {
                                    if (err) {
                                        throw err;
                                    }
                                    
                                    res.body.should.have.property('TagID');
                                    res.body.IsSuccess.should.equal(true);
                                    done();
                });
            });

              it('Adding Haifa University', function (done) {
                 request(url)
                    .post('/UpsertTag')
                    .send("data=" + JSON.stringify({ name: "אוניברסיטת חיפה", icon: "img/university_logos/University_of_Haifa_logo.png", type: "university" }))
                    .expect('Content-Type', /json/)
                    .expect(200)//Status code
                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        
                                        res.body.should.have.property('TagID');
                                        res.body.IsSuccess.should.equal(true);
                                        done();
                });
            });

             it('Adding Weizman University', function (done) {
                request(url)
                    .post('/UpsertTag')
                    .send("data=" + JSON.stringify({ name: "מכון וייצמן", icon: "img/university_logos/Weizmann_Institute_of_Science_logo.png", type: "university" }))
                    .expect('Content-Type', /json/)
                    .expect(200)//Status code
                    .end(function (err, res) {
                                            if (err) {
                                                throw err;
                                            }
                                            
                                            res.body.should.have.property('TagID');
                                            res.body.IsSuccess.should.equal(true);
                                            done();
                });
            });
        });
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
                    .expect(200)//Status code
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
            
            it('Set Tags To User', function (done) {
                request(url)
                       .post('/SetTagsToUser')
                       .send({ data: JSON.stringify({ userId: UserId, tags: ["אוניברסיטת תל אביב","חדוא"] }) })
                       .expect('Content-Type', /json/)
                       .expect(200)//Status code
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
                       .expect(200)//Status code
                       .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // Should.js fluent syntax applied
                    res.body.should.be.instanceof(Array);
                });
                
                done();

            });
            
            it('Get Universities', function (done) {
                request(url)
                       .get('/GetTagsByType/' + 'university')
                       .expect(200)//Status code
                       .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // Should.js fluent syntax applied
                    res.body.tags.should.be.instanceof(Array);
                });
                
                done();

            });
            
            describe('Question', function () {
                                
                var QuestionId;

                //before(function (done) {
                    
                //    // Init QuestionId
                //    request(url)
                //           .get('/GetQuestionsForTag/' + "חדוא")
                //           .expect(200)//Status code
                //           .end(function (err, res) {
                //        if (err) {
                //            throw err;
                //        }
                //        // Should.js fluent syntax applied
                //        res.body.Questions.should.be.instanceof(Array);
                //        if (res.body.Questions != undefined && res.body.Questions[0] != undefined) {
                //            QuestionId = res.body.Questions[0].question_id;
                //            done();
                //        }
                //    });
                    
                //});
                
                it.skip('Asks Question', function (done) {
                    this.timeout(100000);
                    request(url)
                       .post('/AskQuestion')
                       .field('data', JSON.stringify({ userId: UserId, title: "נושא השאלה", details: "תיאור השאלה" }))
                       .attach('file', 'test/sampleImg.jpg')
                       .expect(200)//Status code
                       .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.IsSuccess.should.equal(true);

                        QuestionId = res.body.QuestionID;

                        request(url)
                                    .post('/SetTagsToQuestion')
                                    .send({ data: JSON.stringify({ questionId: res.body.QuestionID, tags: ["חדוא"] }) })
                                    .expect(200)//Status code
                                    .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            // Should.js fluent syntax applied
                            res.body.IsSuccess.should.equal(true);
                        });
                        
                        done();
                    });

                });

                it.skip('Get Questions for Tag', function (done) {
                    request(url)
                           .get('/GetQuestionsForTag/' + "חדוא")
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.Questions.should.be.instanceof(Array);
                        if (res.body.Questions != undefined && res.body.Questions[0] != undefined) {
                            QuestionId = res.body.Questions[0].question_id;

                            done();
                        }
                    });

                });

                it('Answer Question', function (done) {                    
                    this.timeout(100000);
                    request(url)
                           .post('/AnswerQuestion')
                           .field('data', JSON.stringify({ userId: "f588bfb8-e26c-db2a-2462-5e1a9627f6cb", title: "נושא השאלה", details: "תיאור השאלה", questionId: "c9d5f122-eaf0-65b9-a612-3fd147d37be5" }))
                           .attach('file', 'test/sampleImg.jpg')
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.IsSuccess.should.equal(true);
                        
                        done();
                    });
                });
                
                it.skip('Get Questions for Tag and user', function (done) {
                    request(url)
                           .get('/GetQuestionsForTagAndUser/' + "חדוא" + "/" + UserId)
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.Questions.should.be.instanceof(Array);
                    });
                    
                    done();

                });
                
                it.skip('Favorite Question', function (done) {
                    request(url)
                           .post('/SetQuestionFavorite')
                            .send("data=" + JSON.stringify({ questionId: QuestionId, userId: UserId }))
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.IsSuccess.should.equal(true);
                    });
                    
                    done();

                });
                
                it.skip('Unfavorite Question', function (done) {
                    request(url)
                           .post('/UnfavoriteQuestion')
                            .send("data=" + JSON.stringify({ questionId: QuestionId, userId: UserId }))
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.IsSuccess.should.equal(true);
                    });
                    
                    done();

                });
                
                it.skip('Get Favorite Questions for User', function (done) {
                    request(url)
                           .get('/GetFavoriteQuestionsForUser/' + UserId)
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.Questions.should.be.instanceof(Array);
                    });
                    
                    done();

                });
                
                it('Get Questions for tag and is favorite for user', function (done) {
                    request(url)
                           .get('/GetQuestionsForTagAndFavoriteForUser/' + "חדוא" + "/" + UserId)
                           .expect(200)//Status code
                           .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // Should.js fluent syntax applied
                        res.body.Questions.should.be.instanceof(Array);
                    });
                    
                    done();

                });
            });
        });
    });
});