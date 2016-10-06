

var redisClient = require('./index').redisClient

exports.insert = (conn, fp, callback) => redisClient().set('conn:' + conn, fp, callback)
exports.delete = (conn, callback) => redisClient().del('conn:' + conn, callback)
exports.getValue = (conn, callback) => redisClient().get('conn:' + conn, callback)