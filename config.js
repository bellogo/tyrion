// Import env package
require('dotenv').config({ silent: true, path: '.env' })

module.exports = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  dbURL: process.env.DB_URL,
  redisURL: process.env.REDIS_URL
}
