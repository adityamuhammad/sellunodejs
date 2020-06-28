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
    let user = new User({
      firstname: 'muhammad',
      lastname: 'aditya',
      username: 'aditya',
      email: 'aditya@gmail.com',
      password: 'password',
      isActivatedAccount: true
    });
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
  describe('/POST register', () => {
    context('given empty value', ()=> {
      let invalidUser = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      }
      it('it should response bad request, due to validation error', (done) => {
        chai.request(server)
          .post('/api/users/register')
          .send(invalidUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.data.should.have.property('errors');
            res.body.data.errors.should.have.property('lastname');
            res.body.data.errors.should.have.property('firstname');
            res.body.data.errors.should.have.property('username');
            res.body.data.errors.should.have.property('password');
            res.body.data.errors.should.have.property('email');
            done();
          });
      });
    });
    context('given username and email already exist', () => {
      let duplicatedUser = {
        firstname: 'Muhammad',
        lastname: 'Aditya',
        username: 'aditya',
        email: 'aditya@gmail.com',
        password: 'password'
      }
      it('it should response bad request, due to username and email already exists', (done) => {
        chai.request(server)
          .post('/api/users/register')
          .send(duplicatedUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.data.should.have.property('errors');
            res.body.data.errors.should.have.property('username');
            res.body.data.errors.username.properties.should.have.property('message').eql('Username not available.');
            res.body.data.errors.should.have.property('email');
            res.body.data.errors.email.properties.should.have.property('message').eql('Email already exists.');
            done();
          });
      });
    });
    context('given valid user data', () => {
      let validUser = {
        firstname:'Mutia',
        lastname: 'Nur Aisyah',
        username: 'mutia_aisya',
        email: 'mutia_aisya@gmail.com',
        password: 'password'
      }
      it('it should response ok along with data was given', (done) => {
        chai.request(server)
          .post('/api/users/register')
          .send(validUser)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.data.should.have.property('username').eql(validUser.username);
            res.body.data.should.have.property('email').eql(validUser.email);
            done();
          });
      });
    });
  });
});
