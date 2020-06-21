require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const db_config = require('./app/config/db_config.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV !== 'test'){
  app.use(logger('combined'));
}

app.use('/api/users', require('./app/routes/users.js'));
app.use('/api/products', require('./app/routes/products.js'));

const server = app.listen(8081, () => {
  const host = server.address().address
  const port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
});

module.exports = server;
