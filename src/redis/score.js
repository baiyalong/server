var redisClient = require('./index').redisClient

exports.judge = () => { }
exports.calculate = () => { }
exports.rank = () => { }
exports.retrieve = () => { }


const hash = require('./hash');

const tag = 'score:';



exports.get = hash.get(tag)

exports.getAll = hash.getAll(tag)

exports.set = hash.set(tag)

exports.del = hash.del(tag)