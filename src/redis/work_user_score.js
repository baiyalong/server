
const zset = require('./common/zset');
const tag = require('./common/tag');


module.exports = tag(zset, 'work_user_score:')