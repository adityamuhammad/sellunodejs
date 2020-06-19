const User = require('../models/user.js');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const response = require('../helpers/standard_response.js');
require('dotenv').config();

const UsersController = {
  register: async(req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
    const newUser = await user.save((err) =>{
      if(err){
        response.badRequest(res,err);
        return;
      }
      const dataUser = (({username, email}) => ({username, email}))(user);
      response.ok(res, dataUser);
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
        if (isMatch) {
          let token = Jwt.sign({id_user: user.id}, process.env.SECRET_KEY, { expiresIn: '1h' });
          response.ok(res,{token: token});
        } else {
          response.badRequest(res);
        }
      });
    })
    .catch(err => {
      response.badRequest(res,{message: 'User not registered.'});
    });
  }
}

module.exports = UsersController;
