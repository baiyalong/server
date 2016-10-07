var async = require('async');
var Conn = require('../redis/conn');
var User = require('../redis/user');
var Role = require('../redis/role');

exports.connect = (user, callback) => {
    async.waterfall([
        callback => Conn.set(user.conn, user.fp, err => callback(err)),
        callback => User.get(user.fp, (err, res) => Object.assign(user, { online: true, role: user.role || res && res.role !== 'admin' && res.role || 'audience' }) && callback(err)),
        callback => User.set(user.fp, user, err => callback(err)),
        callback => Role.add(user.role, user.fp, err => callback(err))
    ], err => callback(err, user))
}


exports.disconnect = (user, callback) => {
    async.waterfall([
        callback => Conn.get(user.conn, (err, fp) => Object.assign(user, { fp }) && callback(err)),
        callback => User.get(user.fp, (err, res) => Object.assign(user, { conn: '', online: false, role: res.role }) && callback(err)),
        callback => User.set(user.fp, user, err => callback(err)),
        callback => Role.rm(user.role, user.fp, err => callback(err)),
        callback => Conn.del(user.conn, err => callback(err)),
    ], err => callback(err, user))
}



exports.getAll = User.getAll