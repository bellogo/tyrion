const mongoose = require('mongoose');
const { port, dbURL } = require('./config');
const app = require('./app');
require('./src/services/cache')

const nodePort = port || 3000
// connect to DB and Start server
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, });
mongoose.Promise = global.Promise;

mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`Lannister-Pay running on port ${nodePort}`);
  });
  console.log('mongoDB connnected')
}).on('error', () => console.log('DB conection error'));
