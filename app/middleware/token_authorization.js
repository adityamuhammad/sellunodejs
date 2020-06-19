const Jwt = require('jsonwebtoken');
const response = require('../helpers/standard_response.js');
require('dotenv').config();

const TokenAuthorization = {
  verifyToken: (req, res, next) => {
    Jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, (err, results) => {
      if (err) {
        response.unauthorized(res);
      } else {
        req.body.id_user = results.id_user;
        next();
      }
    });
  }
}

module.exports = TokenAuthorization;
