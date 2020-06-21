process.env.NODE_ENV = 'test';
const mongoose = require("mongoose");
const Product = require('../app/models/product.js');
const Jwt = require('jsonwebtoken');

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js");
const should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {
  let token = Jwt.sign({username: 'aditya'}, process.env.SECRET_KEY, { expiresIn: '1h' });
  let product = {
    name: "Laptop Lenovo ThinkPad",
    price: 1000
  }
  beforeEach((done) => {
    Product.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/GET', () => {
    it('it should get all products',(done) => {
      chai.request(server)
        .get('/api/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.status.should.be.eq(200);
          res.body.message.should.be.eq("Success");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST', () => {
    context('Without Authorization', () => {
      it('it should be return 401 unauthorized', (done) => {
        chai.request(server)
          .post('/api/products')
          .send(product)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });
    context('With Authorization', () => {
      context('With invalid data', () => {
        it('it should be return 400 bad request due to validation error', (done) => {
          product.name = "";
          chai.request(server)
            .post('/api/products')
            .set({'Authorization': token})
            .send(product)
            .end((err, res) => {
              res.should.have.status(400);
              done();
            });
        });
      });
      context('With valid data', () => {
        it('it should be data saved successfully.', (done) => {
          product.name = "Laptop Lenovo Thinkpad";
          chai.request(server)
            .post('/api/products')
            .set({'Authorization': token})
            .send(product)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('status');
              res.body.should.have.property('message');
              res.body.should.have.property('data');
              res.body.data.should.be.a('object');
              res.body.data.should.have.property('_id');
              res.body.data.should.have.property('name');
              res.body.data.should.have.property('price');
              res.body.status.should.be.eq(200);
              done();
            });
        });
      });
    });
  });

  describe('/GET/:id', () => {
    context('With valid id', () => {
      it('it should get a product by given id', (done) => {
        let productTest = new Product(product);
        productTest.save((err, product) => {
          chai.request(server)
            .get('/api/products/' + product._id)
            .end((err,res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('object');
              res.body.data.should.have.property('name').eql(product.name);
              res.body.data.should.have.property('price').eql(product.price);
              done();
            });
        });
      });
    });
    context('With invalid id', () => {
      it('it should be send 404 response', (done) => {
        chai.request(server)
          .get('/api/products/' + '900')
          .end((err,res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  describe('/PUT/:id', () => {
    context('Without Authorization', () => {
      it('it should raise unauthorized user', (done)=> {
        let productTest = new Product(product);
        productTest.save((err, product) => {
          chai.request(server)
            .put('/api/products/'+ product._id)
            .send({name: 'Laptop LG', price: 2000})
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
      });
    });
    context('With Authorization', () => {
      it('it should be update a product given the id', (done)=> {
        let productTest = new Product(product);
        productTest.save((err, product) => {
          chai.request(server)
            .put('/api/products/'+ productTest._id)
            .set({'Authorization': token})
            .send({name: 'Laptop LG', price: 2000})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('object');
              res.body.data.should.have.property('name').eql('Laptop LG');
              res.body.data.should.have.property('price').eql(2000);
              done();
            });
        });
      });
    });
  });
  describe('/DELETE/:id', () => {
    context('Without Authorization', () => {
      it('it should raise unauthorized user', (done)=> {
        let productTest = new Product(product);
        productTest.save((err, product) => {
          chai.request(server)
            .delete('/api/products/'+ product._id)
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
      });
    });
    context('With Authorization', () => {
      it('it should delete a product by given id', (done)=> {
        let productTest = new Product(product);
        productTest.save((err, product) => {
          chai.request(server)
            .delete('/api/products/'+ product._id)
            .set({'Authorization': token})
            .end((err, res) => {
              res.should.have.status(204);
              done();
            });
        });
      });
    });
  });
});
