const Jwt = require('jsonwebtoken');
const response = require('../helpers/standard_response.js');
require('dotenv').config();

const TokenAuthorization = {
  verifyToken: (req, res, next) => {
    Jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, (err, results) => {
      if (err) {
        return response.unauthorized(res);
      } else {
        next();
      }
    });
  }
}

module.exports = TokenAuthorization;
