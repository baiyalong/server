var async = require('async');
var redisClient = require('./index').redisClient;


exports.insert = (user, callback) => redisClient().hmset('user:' + user.fp, user, callback)

exports.delete = (fp, callback) => {
    if (!Array.isArray(fp)) fp = [fp]
    if (!fp.length) return callback()
    redisClient().batch(fp.map(e => ['del', 'user:' + e])).exec(callback)
}

exports.update = (fp, user, callback) => {
    if (!Array.isArray(fp)) fp = [fp]
    if (!fp.length) return callback()
    redisClient().batch(fp.map(e => ['hmset', 'user:' + e, user])).exec(callback)
}

exports.get = (fp, callback) => {
    if (!Array.isArray(fp)) fp = [fp]
    if (!fp.length) return callback()
    redisClient().batch(fp.map(e => ['hgetall', 'user:' + e])).exec(callback)
}

exports.getAll = callback => {
    async.waterfall([
        callback => redisClient().keys('user:*', callback),
        (fp, callback) => this.get(fp, callback)
    ], callback)
}

exports.search = (search, callback) => {
    if (!serch) callback()
    var reg = new RegExp(search, 'im')
    async.waterfall([
        callback => this.getAll(callback),
        (arr, callback) => arr.filter(e => Object.keys(e).some(f => reg.test(e[f])))
    ], callback)
}