'use strict'


var socketio = require('socket.io');


var io = null
exports.start = function (app, callback) {
    io = socketio(app)
    io.on('connection', function (socket) {
        console.log('io connect ', socket.id, socket.client.id, socket.conn.id)
        socket.on('register', function (data) {
            console.log(data)
        })
    });
    callback()
}




















































