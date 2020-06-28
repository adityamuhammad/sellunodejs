const User = require('../models/user.js');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const response = require('../helpers/standard_response.js');
const crypto = require('crypto');

const UsersController = {
  register: async(req, res) => {
    let user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      activationToken: crypto.randomBytes(64).toString('hex'),
      activationTokenExpiredAt: new Date().setHours(new Date().getHours() + 12) //12 hours from now
    });
    await user.save((err) =>{
      if(err){
        return response.badRequest(res,err);
      }
      let data = {
        username: user.username,
        email: user.email
      }
      //reserved for send email activation
      return response.ok(res, data);
    });
  },
  login: (req, res) => {
    User.findOne().or([
      {username: req.body.username},
      {email: req.body.username}
    ])
    .then((user) => {
      user.comparePassword(req.body.password,(err, isMatch) => {
        if (err) throw err;
        if(!user.isActivatedAccount){
          return response.badRequest(res, {message: 'Account is innactive.'});
        }
        if (isMatch) {
          let token = Jwt.sign({username: user.username}, process.env.SECRET_KEY, { expiresIn: '1h' });
          return response.ok(res,{token: token});
        }
        return response.badRequest(res, {message: 'Invalid password.'});
      });
    })
    .catch(err => {
      return response.badRequest(res,{message: 'User not registered.'});
    });
  },
  activateAccount: (req, res) => {
    User.findOneAndUpdate(
      {
        activationToken: req.params.token,
        activationTokenExpiredAt: {
          $gt: new Date()
        }
      }, {
        activationToken: null,
        activationTokenExpiredAt: null,
        isActivatedAccount: true
      },
      {},
      (err, user) => {
        if (err) {
          return response.internalError(res);
        }
        if(user){
          return response.ok(res);
        }
        return response.notFound(res);
      }
    );
  },
  forgotPassword: (req, res) => {
    User.findOneAndUpdate(
      {email: req.body.email},
      {
        resetPasswordToken: crypto.randomBytes(64).toString('hex'),
        resetPasswordTokenExpiredAt: new Date().setHours(new Date().getHours() + 1) //1 hours from now
      },
      {},
      (err, user)=> {
      if(err){
        return response.internalError(res);
      }
      if(user) {
        //reserved for send email forgot password
        return response.ok(res);
      }
      return response.notFound(res);
    });
  },
  resetPasswordToken: (req, res) => {
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordTokenExpiredAt: { $gt: new Date() }
      },
      (err, user) => {
        if(err){
          return response.internalError(res);
        }
        if(user){
          return response.ok(res);
        }
        return response.notFound(res);
      }
    );
  },
  resetPassword: (req, res) => {
    User.findOneAndUpdate(
      {
        resetPasswordToken: req.params.token,
        resetPasswordTokenExpiredAt: { $gt: new Date() }
      }, {
        resetPasswordToken: null,
        resetPasswordTokenExpiredAt: null,
        password: req.body.password
      },
      {},
      (err, user) => {
        if(err){
          return response.internalError(res);
        }
        if(user){
          return response.ok(res);
        }
        return response.notFound(res);
      }
    );
  }
}

module.exports = UsersController;
