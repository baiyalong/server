var async = require('async');
var redisClient = require('../index').redisClient;

exports.insert = (key, value, callback) => redisClient().hmset(key, value, callback)

exports.delete = (keys, callback) => {
    if (!Array.isArray(keys)) keys = [keys]
    if (!keys.length) return callback()
    redisClient().batch(keys.map(e => ['del', e])).exec(callback)
}

exports.update = (keys, value, callback) => {
    if (!Array.isArray(keys)) keys = [keys]
    if (!keys.length) return callback()
    redisClient().batch(keys.map(e => ['hmset', e, value])).exec(callback)
}

exports.get = (keys, callback) => {
    if (!Array.isArray(keys)) keys = [keys]
    if (!keys.length) return callback()
    redisClient().batch(keys.map(e => ['hgetall', e])).exec(callback)
}

exports.getAll = (name, callback) => {
    async.waterfall([
        callback => redisClient().keys(name + '*', callback),
        (keys, callback) => this.get(keys, callback)
    ], callback)
}

exports.search = (name, search, callback) => {
    if (!serch) callback()
    var reg = new RegExp(search, 'im')
    async.waterfall([
        callback => this.getAll(name, callback),
        (arr, callback) => arr.filter(e => Object.keys(e).some(f => reg.test(e[f])))
    ], callback)
}




