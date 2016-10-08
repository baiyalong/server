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

        socket.on('role.change', (user, callback) => Role.change(user, (err, user) => callback(err, user) || io.to('admin').emit('user.set', user)));
        socket.on('role.randJudge', (num, callback) => Role.randJudge(num, (err, users) => callback(err, users) || io.emit('user.set', users)));

        socket.on('work.set', (work, callback) => Work.set(work, (err, res) => callback(err, res) || io.emit('work.set', work)));
        socket.on('work.del', (work, callback) => Work.del(work, (err, res) => callback(err, res) || io.emit('work.del', work)));
        socket.on('work.getAll', Work.getAll);

        socket.on('score.set', (user, work, score, callback) => Score.set(user, work, score, (err, scores) => callback(err, scores) || io.emit('score.set', scores)));

        socket.on('error', err => console.error(err.message))
    });
    console.log(Date(), 'io start')
    callback(null)
}


// exports.io = () => io
















































