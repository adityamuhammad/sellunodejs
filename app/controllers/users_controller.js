const User = require('../models/user.js');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const response = require('../helpers/standard_response.js');

const UsersController = {
  register: async(req, res) => {
    let user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
    await user.save((err) =>{
      if(err){
        return response.badRequest(res,err);
      }
      let dataUser = (({username, email}) => ({username, email}))(user);
      return response.ok(res, dataUser);
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
          let token = Jwt.sign({username: user.username}, process.env.SECRET_KEY, { expiresIn: '1h' });
          return response.ok(res,{token: token});
        }
        return response.badRequest(res, {message: 'Invalid password.'});
      });
    })
    .catch(err => {
      return response.badRequest(res,{message: 'User not registered.'});
    });
  }
}

module.exports = UsersController;
