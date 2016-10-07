'use strict'


var socketio = require('socket.io');
var redis = require('../redis');
var User = require('./user');
var Role = require('./role');
var Work = require('./work');
var Score = require('./score');

var io = null

exports.start = function (app, callback) {
    io = socketio(app);
    io.on('connection', socket => {
        var conn = socket.conn.id;
        socket.on('user.connect', (user, callback) => User.connect(Object.assign(user, { conn }), (err, user) => callback(err, user) || socket.join(user.role) && io.to('admin').emit('user.set', user)));
        socket.on('disconnect', () => User.disconnect({ conn }, (err, user) => socket.leave(user.role) && io.to('admin').emit('user.set', user)));
        socket.on('user.getAll', User.getAll);

        socket.on('role.change', Role.change);
        socket.on('role.randomJudge', Role.randomJudge);

        socket.on('work.insert', Work.insert);
        socket.on('work.delete', Work.delete);
        socket.on('work.update', Work.update);
        socket.on('work.retrieve', Work.retrieve);

        socket.on('score.judge', Score.judge);

        socket.on('error', err => console.error(err.message))
    });
    console.log(Date(), 'io start')
    callback(null)
}


// exports.io = () => io
















































