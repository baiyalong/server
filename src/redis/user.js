var async = require('async');
var redisClient = require('./index').redisClient;


exports.get = (fp, callback) => redisClient().hgetall('user:' + fp, callback)

exports.getAll = callback => {
    async.waterfall([
        callback => redisClient().keys('user:*', callback),
        (fp, callback) => redisClient().batch(fp.map(e => ['hgetall', 'user:' + e])).exec(callback)
    ], callback)
}

exports.set = (fp, user, callback) => {
    if (!Array.isArray(fp)) fp = [fp]
    if (!fp.length) return callback()
    redisClient().batch(fp.map(e => ['hmset', 'user:' + e, user])).exec(callback)
}

exports.del = (fp, callback) => {
    if (!Array.isArray(fp)) fp = [fp]
    if (!fp.length) return callback()
    redisClient().batch(fp.map(e => ['del', 'user:' + e])).exec(callback)
}

exports.find = (search, callback) => {
    if (!search) callback()
    var reg = new RegExp(search, 'im')
    async.waterfall([
        callback => this.getAll(callback),
        (arr, callback) => arr.filter(e => Object.keys(e).some(f => reg.test(e[f])))
    ], callback)
}