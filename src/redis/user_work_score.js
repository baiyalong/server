
const zset = require('./common/zset');
const tag = require('./common/tag');


module.exports = tag(zset, 'user_work_score:')