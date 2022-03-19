const mongoose = require('mongoose')
const { port, dbURL } = require('./config')
const app = require('./app')

app.listen(port, () => {
  console.log(`Lannister-Pay running on port ${port}`)
})
// connect to DB and Start server
// mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.Promise = global.Promise

// mongoose.connection.once('open', () => {
  
//   console.log('mongoDB connnected')
// }).on('error', () => console.log('DB conection error'))
