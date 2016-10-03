'use strict'


var socketio = require('socket.io');
var redis = require('./redis')

var io = null
exports.start = function (app, callback) {
    io = socketio(app)
    io.on('connection', function (socket) {

        socket.on('user.connect', (user, callback) => redis.user.connect(Object.assign(user, { conn: socket.conn.id }), callback))
        socket.on('disconnect', () => redis.user.disconnect(socket.conn.id))
        socket.on('user.retrieve', redis.user.retrieve)
        socket.on('user.random', (num, callback) => redis.user.random(num, () => {

        }))

        socket.on('work.insert', redis.work.insert)
        socket.on('work.delete', redis.work.delete)
        socket.on('work.update', redis.work.update)
        socket.on('work.retrieve', redis.work.retrieve)

    });
    callback()
}




















































