process.env.NODE_ENV = 'test';
const mongoose = require("mongoose");
const User = require('../app/models/user.js');
const Jwt = require('jsonwebtoken');

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js");
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
    let user = new User({username: 'aditya', email: 'aditya@gmail.com', password: 'password'});
    user.save((err) => {
      if(err) throw err;
      done();
    });
  });
  afterEach((done) => {
    User.deleteMany({}, (err) => {
      if(err) throw err;
      done();
    });
  });
  describe('/POST login', () => {
    context('given username not registered', () => {
      let invalidUser = { username: 'adityax', password: '123'}
      it('it should response bad request, user not registered.', (done) => {
        chai.request(server)
          .post('/api/users/login')
          .send(invalidUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.data.should.have.property('message').eql('User not registered.');
            done();
          });
      });
    });
    context('given valid username, but invalid password', () => {
      let invalidUser = { username: 'aditya', password: 'passw'}
      it('it should response bad request, invalid password.', (done) => {
        chai.request(server)
          .post('/api/users/login')
          .send(invalidUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.data.should.have.property('message').eql('Invalid password.');
            done();
          });
      });
    });
    context('given valid username and valid password', () => {
      let validUser = { username: 'aditya', password: 'password'}
      it('it should response bad request, invalid password.', (done) => {
        chai.request(server)
          .post('/api/users/login')
          .send(validUser)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.have.property('token');
            done();
          });
      });
    });
  });
});
