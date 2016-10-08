const async = require('async');
const Work = require('../redis/work');
const Score = require('../redis/score');



exports.set = (work, callback) => Work.set(work.id, callback)


exports.del = (search, callback) => {
    async.waterfall([
        callback => Work.del(work.id, err => callback(err)),
        callback => Score.del(work.id, callback)
    ], callback)
}


exports.getAll = callback => {
    var res = {}
    async.waterfall([
        callback => Work.getAll(work.id, (err, works) => Object.assign(res, { works }) && callback(err)),
        callback => Score.getAll(work.id, (err, scores) => Object.assign(res, { scores }) && callback(err))
    ], err => callback(err, res))
}