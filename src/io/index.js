'use strict'


var socketio = require('socket.io');
var redis = require('../redis');
var user = require('./user');
var role = require('./role');
var work = require('./work');
var score = require('./score');

// var io = null
exports.start = function (app, callback) {
    var io = socketio(app);
    io.on('connection', socket => {
        var conn = socket.conn.id;
        socket.on('user.connect', (usr, callback) => user.connect(Object.assign(usr, { conn }), callback));
        socket.on('disconnect', () => user.disconnect(conn));

        socket.on('role.change', role.change);
        socket.on('role.randomJudge', role.randomJudge);

        socket.on('work.insert', work.insert);
        socket.on('work.delete', work.delete);
        socket.on('work.update', work.update);
        socket.on('work.retrieve', work.retrieve);

        socket.on('score.judge', score.judge);
    });
    callback()
}




















































