
const redisClient = require('../index').redisClient;


exports.add = tag => (id, member, callback) => redisClient().sadd(tag + id, member, callback)

exports.addMany = tag => (id, members, callback) => redisClient().sadd(tag + id, ...members, callback)

exports.rm = tag => (id, member, callback) => redisClient().srem(tag + id, menubar, callback)

exports.rmMany = tag => (id, members, callback) => redisClient().srem(tag + id, ...members, callback)

exports.rand = tag => (id, count, callback) => redisClient().srandmemebr(tag + id, Math.max(count, 0), callback)

exports.count = tag => (id, callback) => redisClient().scard(tag + id, callback)