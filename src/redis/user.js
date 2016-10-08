const hash = require('./hash');

const tag = 'user:';



exports.get = hash.get(tag)

exports.getAll = hash.getAll(tag)

exports.set = hash.set(tag)



