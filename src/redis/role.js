

var redisClient = require('./index').redisClient

exports.add = (role, conn, callback) => redisClient().sadd('role:' + role, conn, callback)
exports.rm = (role, conn, callback) => redisClient().srem('role:' + role, conn, callback)


exports.get = (role, callback) => redisClient().smembers('role:' + role, callback)