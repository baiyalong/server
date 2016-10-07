
const socketio = require('socket.io');
const user = require('./user');
const role = require('./role');
const work = require('./work');
const score = require('./score');

var io = null
const log = (event, err) => console.error(Date(), 'io error -- ', ' event:', event, ' err:', err.message)


exports.start = function (app, callback) {
    io = socketio(app);
    io.on('connection', socket => {
        const conn = socket.conn.id;
        socket.on('user.connect', (u, callback) => user.connect(Object.assign(u, { conn }), (err, u, s) => callback(err, u, s) || err ? log('user.connect', err) : socket.join(u.role) && io.to('admin').emit('user.set', u)));
        socket.on('disconnect', () => user.disconnect({ conn }, (err, u) => err ? log('user.disconnect', err) : socket.leave(u.role) && io.to('admin').emit('user.set', u)));
        socket.on('user.getAll', callback => user.getAll((err, us) => callback(err, us) || err ? log('user.getAll', err) : null));

        socket.on('role.change', (u, callback) => role.change(u, (err, u) => callback(err, u) || err ? log('role.change', err) : io.to('admin').emit('user.set', u)));
        socket.on('role.randJudge', (count, callback) => role.randJudge(count, (err, us) => callback(err, us) || err ? log('role.randJudge', err) : io.emit('user.set', us)));

        socket.on('work.set', (w, callback) => work.set(w, err => callback(err) || err ? log('work.set', err) : io.emit('work.set', w)));
        socket.on('work.del', (w, callback) => work.del(w, err => callback(err) || err ? log('work.del', err) : io.emit('work.del', w)));
        socket.on('work.getAll', callback => work.getAll((err, ws) => callback(err, ws) || err ? log('work.getAll', err) : null));

        socket.on('score.set', (u, w, s, callback) => score.set(u, w, s, (err, ss) => callback(err) || err ? log('score.set', err) : io.emit('score.set', ss)));

        socket.on('error', err => log('socket error ', err))
    });
    console.log(Date(), 'io start')
    callback(null)
}


// exports.io = () => io















































