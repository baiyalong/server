
var async = require('async');
var redis = require("redis");
var config = require('../config');
var client = null;


exports.connect = function (callback) {
    client = redis.createClient(config.redis_url);
    client.on("error", err => console.error("redis error " + err))
    client.on('ready', () => console.log(Date(), 'redis connect') || reset(callback))
}

exports.redisClient = () => client

function reset(callback) {
    async.waterfall([
        callback => client.keys('conn:*', callback),
        (keys, callback) => client.keys('role:*', (err, res) => callback(err, keys.concat(res))),
        (keys, callback) => client.batch(keys.map(e => ['del', e])).exec(err => callback(err)),
        callback => client.keys('user:*', callback),
        (keys, callback) => client.batch(keys.map(e => ['hmset', e, { online: false, conn: '' }])).exec(callback)
    ], err => callback(err))
}


