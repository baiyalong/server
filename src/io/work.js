const async = require('async');
const work = require('../redis/work');
const score = require('../redis/score');



exports.set = (w, callback) => work.set(w.id, callback)


exports.del = (id, callback) => {
    async.waterfall([
        callback => work.del(w.id, err => callback(err)),
        callback => score.del(w.id, callback)
    ], callback)
}


exports.getAll = callback => {
    var res = {}
    async.waterfall([
        callback => work.getAll(w.id, (err, works) => Object.assign(res, { ws }) && callback(err)),
        callback => score.getAll(w.id, (err, scores) => Object.assign(res, { ss }) && callback(err))
    ], err => callback(err, res))
}