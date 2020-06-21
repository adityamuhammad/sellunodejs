require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DBHOST_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection success');
});
