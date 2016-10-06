'use strict'

var async = require('async');
var redis = require("redis");

var client = null;

exports.connect = function (callback) {
    client = redis.createClient();


    client.on("error", function (err) {
        console.error("redis error " + err);
    });

    client.on('ready', () => init(this.user.disconnect, callback))


}

//--for server restart
function init(disconnect, callback) {
    async.waterfall([
        callback => {
            client.keys('conn:*', callback)
        },
        (res, callback) => {
            async.each(res, (e, callback) => disconnect(e.replace('conn:', ''), callback), callback)
        }
    ], callback)
}

exports.user = {
    connect: (user, callback) => {
        if (user.role == 'admin')
            client.hmset('admin:' + user.id, {
                id: user.id,
                conn: user.conn
            }, callback)
        else
            async.waterfall([
                callback => {
                    client.set('conn:' + user.conn, user.id, callback)
                },
                (res, callback) => {
                    client.hget('user:' + user.id, 'role', callback)
                },
                (res, callback) => {
                    var role = res || 'audience';
                    client.hmset('user:' + user.id, {
                        id: user.id,
                        conn: user.conn,
                        online: true,
                        role
                    }, (err, reply) => {
                        callback(err, role)
                    })
                },
            ], callback)
    },
    disconnect: (conn, callback) => {
        async.waterfall([
            callback => {
                client.get('conn:' + conn, callback)
            },
            (res, callback) => {
                if (res)
                    client.hmset('user:' + res, {
                        conn: '',
                        online: false
                    }, callback)
                else callback(null, null)
            },
            (res, callback) => {
                client.del('conn:' + conn, callback)
            },
        ], (err) => {
            if (err) console.error(err)
            if (callback) callback(err)
        })
    },
    roleChange: (user, role, callback) => {

    },
    reset: (callback) => {
        async.waterfall([
            callback => {
                client.keys('conn:*', callback)
            },
            (res, callback) => {
                client.batch(res.map(e => ['get', e])).exec(callback)
            },
            (res, callback) => {
                client.batch(res.map(e => ['hset', 'user:' + e, 'role', 'audience'])).exec(callback)
            }
        ], callback)
    },
    random: (num, callback) => {
        var num = Math.max(num, 0) || 0;
        async.waterfall([
            callback => {
                client.keys('conn:*', callback)
            },
            (res, callback) => {
                client.batch(res.map(e => ['get', e])).exec(callback)
            },
            (res, callback) => {
                callback(null, res.sort(() => Math.random() > .5 ? 1 : -1));
            },
            (res, callback) => {
                client.batch(res.slice(0, num).map(e => ['hset', 'user:' + e, 'role', 'judge'])).exec((err, reply) => callback(err, res))
            },
            (res, callback) => {
                client.batch(res.slice(num).map(e => ['hset', 'user:' + e, 'role', 'audience'])).exec((err, reply) => callback(err, res))
            },
            (res, callback) => {
                callback(null);
            }
        ], callback)
    },
    inform: (conns, role, callback) => {
        // io.sockets.socket(socketid).emit('message', 'for your eyes only');
    },
    retrieve: (search, callback) => retrieve('user:', ['online', 'role'], search, callback)
}

exports.work = {
    insert: (work, callback) => {
        client.hmset('work:' + work.id, work, callback)
    },
    delete: (arr, callback) => {
        if (arr && Array.isArray(arr) && arr.length)
            client.batch(arr.map(e => ['del', 'work:' + e])).exec(callback)
    },
    update: (work, callback) => {
        var arr = work.id;
        if (arr && Array.isArray(arr) && arr.length)
            client.batch(arr.map(e => ['hmset', 'work:' + e, Object.assign(work, { id: e })])).exec(callback)
    },
    retrieve: (search, callback) => retrieve('work:', ['title', 'content', 'author'], search, callback)
}

function retrieve(key, fields, search, callback) {
    async.waterfall([
        callback => {
            client.keys(key + '*', callback)
        },
        (res, callback) => {
            client.batch(res.map(e => ['hgetall', e])).exec(callback)
        },
        (res, callback) => {
            callback(null, search ? res.filter(e => fields.some(f => new RegExp(search, 'im').test(f))) : null)
        },
    ], callback)
}




exports.score = {
    judge: (user, work, score, callback) => {
        async.waterfall([
            callback => {
                client.zadd('score:' + work, score, 'user:' + user, callback)
            },
            (res, callback) => {
                client.zrange('score:' + work, 0, -1, 'withscores', callback)
            },
            (res, callback) => {
                var score = res.filter((e, i) => i % 2).slice(1, -1).reduce((p, c, i, a) => p + c / a.length, 0).toFixed(2)
                client.zadd('score:', score, 'work:' + work, callback)
            }
        ], callback)

    },
    broadcast: () => {

    },
    reset: (callback) => {
        async.waterfall([
            callback => {
                client.keys('score:*', callback)
            },
            (res, callback) => {
                client.batch(res.map(e => ['del', e])).exec(callback)
            }
        ], callback)
    }
}

