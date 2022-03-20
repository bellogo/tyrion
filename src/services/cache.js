const mongoose = require('mongoose');
const redis = require('redis');
const { redisURL } = require('../../config');

const client = redis.createClient({
  url: redisURL
});

(async () => {
  await client.connect();
})();

client.on('connect', function () {
  console.log('REDIS Connected!');
});
client.on('error', (err) => console.log('Redis Client Error', err));

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || 'default');

  return this;
}

mongoose.Query.prototype.exec = async function () {
  try {
    if (!this.useCache) {
      return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    }))

    const cacheValue = await client.HGET(this.hashKey, key);

    if (cacheValue) {
      const doc = JSON.parse(cacheValue);
      return doc;
    }

    const result = await exec.apply(this, arguments)

    await client.HSET(this.hashKey, key, JSON.stringify(result), 'EX', 60 * 60 * 24)
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  async clearHash (hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}
