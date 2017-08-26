'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bodyweight = mongoose.model('Bodyweight'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  bodyweight;

/**
 * Bodyweight routes tests
 */
describe('Bodyweight CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Bodyweight
    user.save(function () {
      bodyweight = {
        name: 'Bodyweight name'
      };

      done();
    });
  });

  it('should be able to save a Bodyweight if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Bodyweight
        agent.post('/api/bodyweights')
          .send(bodyweight)
          .expect(200)
          .end(function (bodyweightSaveErr, bodyweightSaveRes) {
            // Handle Bodyweight save error
            if (bodyweightSaveErr) {
              return done(bodyweightSaveErr);
            }

            // Get a list of Bodyweights
            agent.get('/api/bodyweights')
              .end(function (bodyweightsGetErr, bodyweightsGetRes) {
                // Handle Bodyweights save error
                if (bodyweightsGetErr) {
                  return done(bodyweightsGetErr);
                }

                // Get Bodyweights list
                var bodyweights = bodyweightsGetRes.body;

                // Set assertions
                (bodyweights[0].user._id).should.equal(userId);
                (bodyweights[0].name).should.match('Bodyweight name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bodyweight if not logged in', function (done) {
    agent.post('/api/bodyweights')
      .send(bodyweight)
      .expect(403)
      .end(function (bodyweightSaveErr, bodyweightSaveRes) {
        // Call the assertion callback
        done(bodyweightSaveErr);
      });
  });

  it('should not be able to save an Bodyweight if no name is provided', function (done) {
    // Invalidate name field
    bodyweight.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Bodyweight
        agent.post('/api/bodyweights')
          .send(bodyweight)
          .expect(400)
          .end(function (bodyweightSaveErr, bodyweightSaveRes) {
            // Set message assertion
            (bodyweightSaveRes.body.message).should.match('Please fill Bodyweight name');

            // Handle Bodyweight save error
            done(bodyweightSaveErr);
          });
      });
  });

  it('should be able to update an Bodyweight if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Bodyweight
        agent.post('/api/bodyweights')
          .send(bodyweight)
          .expect(200)
          .end(function (bodyweightSaveErr, bodyweightSaveRes) {
            // Handle Bodyweight save error
            if (bodyweightSaveErr) {
              return done(bodyweightSaveErr);
            }

            // Update Bodyweight name
            bodyweight.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bodyweight
            agent.put('/api/bodyweights/' + bodyweightSaveRes.body._id)
              .send(bodyweight)
              .expect(200)
              .end(function (bodyweightUpdateErr, bodyweightUpdateRes) {
                // Handle Bodyweight update error
                if (bodyweightUpdateErr) {
                  return done(bodyweightUpdateErr);
                }

                // Set assertions
                (bodyweightUpdateRes.body._id).should.equal(bodyweightSaveRes.body._id);
                (bodyweightUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bodyweights if not signed in', function (done) {
    // Create new Bodyweight model instance
    var bodyweightObj = new Bodyweight(bodyweight);

    // Save the bodyweight
    bodyweightObj.save(function () {
      // Request Bodyweights
      request(app).get('/api/bodyweights')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bodyweight if not signed in', function (done) {
    // Create new Bodyweight model instance
    var bodyweightObj = new Bodyweight(bodyweight);

    // Save the Bodyweight
    bodyweightObj.save(function () {
      request(app).get('/api/bodyweights/' + bodyweightObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bodyweight.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bodyweight with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bodyweights/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bodyweight is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bodyweight which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bodyweight
    request(app).get('/api/bodyweights/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bodyweight with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bodyweight if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Bodyweight
        agent.post('/api/bodyweights')
          .send(bodyweight)
          .expect(200)
          .end(function (bodyweightSaveErr, bodyweightSaveRes) {
            // Handle Bodyweight save error
            if (bodyweightSaveErr) {
              return done(bodyweightSaveErr);
            }

            // Delete an existing Bodyweight
            agent.delete('/api/bodyweights/' + bodyweightSaveRes.body._id)
              .send(bodyweight)
              .expect(200)
              .end(function (bodyweightDeleteErr, bodyweightDeleteRes) {
                // Handle bodyweight error error
                if (bodyweightDeleteErr) {
                  return done(bodyweightDeleteErr);
                }

                // Set assertions
                (bodyweightDeleteRes.body._id).should.equal(bodyweightSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bodyweight if not signed in', function (done) {
    // Set Bodyweight user
    bodyweight.user = user;

    // Create new Bodyweight model instance
    var bodyweightObj = new Bodyweight(bodyweight);

    // Save the Bodyweight
    bodyweightObj.save(function () {
      // Try deleting Bodyweight
      request(app).delete('/api/bodyweights/' + bodyweightObj._id)
        .expect(403)
        .end(function (bodyweightDeleteErr, bodyweightDeleteRes) {
          // Set message assertion
          (bodyweightDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bodyweight error error
          done(bodyweightDeleteErr);
        });

    });
  });

  it('should be able to get a single Bodyweight that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Bodyweight
          agent.post('/api/bodyweights')
            .send(bodyweight)
            .expect(200)
            .end(function (bodyweightSaveErr, bodyweightSaveRes) {
              // Handle Bodyweight save error
              if (bodyweightSaveErr) {
                return done(bodyweightSaveErr);
              }

              // Set assertions on new Bodyweight
              (bodyweightSaveRes.body.name).should.equal(bodyweight.name);
              should.exist(bodyweightSaveRes.body.user);
              should.equal(bodyweightSaveRes.body.user._id, orphanId);

              // force the Bodyweight to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Bodyweight
                    agent.get('/api/bodyweights/' + bodyweightSaveRes.body._id)
                      .expect(200)
                      .end(function (bodyweightInfoErr, bodyweightInfoRes) {
                        // Handle Bodyweight error
                        if (bodyweightInfoErr) {
                          return done(bodyweightInfoErr);
                        }

                        // Set assertions
                        (bodyweightInfoRes.body._id).should.equal(bodyweightSaveRes.body._id);
                        (bodyweightInfoRes.body.name).should.equal(bodyweight.name);
                        should.equal(bodyweightInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Bodyweight.remove().exec(done);
    });
  });
});
