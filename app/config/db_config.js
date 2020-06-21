const mongoose = require('mongoose');

const nodeEnvirontment = process.env.NODE_ENV;
var connectionHost = "";
if (nodeEnvirontment === 'test'){
  connectionHost = process.env.DBHOST_TEST;
} else if (nodeEnvirontment == 'dev') {
  connectionHost = process.env.DBHOST_DEV;
} else if (nodeEnvirontment == 'prod') {
  connectionHost = process.env.DBHOST_PROD;
} else {
  connectionHost = process.env.DBHOST_DEV;
}

mongoose.connect(connectionHost, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
