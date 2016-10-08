const hash = require('./hash');

const tag = 'work:';



exports.get = hash.get(tag)

exports.getAll = hash.getAll(tag)

exports.set = hash.set(tag)

exports.del = hash.del(tag)