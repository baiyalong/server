
const redisClient = require('../index').redisClient;


exports.add = tag => (id, member, score, callback) => redisClient().zadd(tag + id, score, member, callback)

exports.rm = tag => (id, member, callback) => redisClient().zrem(tag + id, menubar, callback)

exports.del = tag => (id, callback) => redisClient().del(tag + id, callback)

exports.range = tag => (id, callback) => redisClient().zrange(tag + id, 0, -1, 'withscores', (err, res) => callback(err, toObj(res)))

exports.revrange = tag => (id, callback) => redisClient().zrevrange(tag + id, 0, -1, 'withscores', (err, res) => callback(err, toObj(res)))


const toObj = arr => arr.map((e, i, a) => i % 2 ? null : { [e]: a[i + 1] }).reduce((p, c) => Object.assign(p, c), {})