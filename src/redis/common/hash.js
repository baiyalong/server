
const async = require('async');
const redisClient = require('../index').redisClient;


exports.get = tag => (id, callback) => redisClient().hgetall(tag + id, callback)

exports.getAll = tag => callback => {
    async.waterfall([
        callback => redisClient().keys(tag + '*', callback),
        (keys, callback) => redisClient().batch(keys.map(e => ['hgetall', e])).exec(callback)
    ], callback)
}

exports.set = tag => (id, value, callback) => redisClient().hmset(tag + id, value, callback)

exports.del = tag => (id, callback) => redisClient().del(tag + id, callback)


// exports.find = (search, callback) => {
//     if (!search) callback()
//     var reg = new RegExp(search, 'im')
//     async.waterfall([
//         callback => this.getAll(callback),
//         (arr, callback) => arr.filter(e => Object.keys(e).some(f => reg.test(e[f])))
//     ], callback)
// }