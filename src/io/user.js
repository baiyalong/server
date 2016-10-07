const async = require('async');
const conn = require('../redis/conn');
const user = require('../redis/user');
const role = require('../redis/role');
const user_work_score = require('../redis/user_work_score');

exports.connect = (u, callback) => {
    async.waterfall([
        callback => conn.set(u.conn, u.id, err => callback(err)),
        callback => user.get(u.id, (err, res) => Object.assign(u, { online: true, role: u.role || res && res.role !== 'admin' && res.role || 'audience' }) && callback(err)),
        callback => user.set(u.id, u, err => callback(err)),
        callback => role.add(u.role, u.id, err => callback(err)),
        callback => user_work_score.range(u.id, callback)
    ], (err, s) => callback(err, u, s))
}


exports.disconnect = (u, callback) => {
    async.waterfall([
        callback => conn.get(u.conn, (err, id) => Object.assign(u, { id }) && callback(err)),
        callback => user.get(u.id, (err, res) => Object.assign(u, { conn: '', online: false, role: res.role }) && callback(err)),
        callback => user.set(u.id, u, err => callback(err)),
        callback => role.rm(u.role, u.id, err => callback(err)),
        callback => conn.del(u.conn, err => callback(err)),
    ], err => callback(err, u))
}


exports.getAll = user.getAll