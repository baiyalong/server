
const redisClient = require('../index').redisClient;


exports.get = tag => (id, callback) => redisClient().get(tag + id, callback)

exports.set = tag => (id, value, callback) => redisClient().set(tag + id, value, callback)

exports.del = tag => (id, callback) => redisClient().del(tag + id, callback)