

var redisClient = require('./index').redisClient

exports.set = (conn, fp, callback) => redisClient().set('conn:' + conn, fp, callback)
exports.del = (conn, callback) => redisClient().del('conn:' + conn, callback)
exports.get = (conn, callback) => redisClient().get('conn:' + conn, callback)