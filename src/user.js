'use strict'


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: [true, '用户名不能为空！'], unique: true },
    password: { type: String, required: [true, '密码不能为空！'] },
    description: String,
    role: { type: String, defalut: 'user', enum: ['user', 'admin'] },
    projects: [Schema.Types.ObjectId]
});


var user = mongoose.model('user', userSchema);
user.errMsg = function (error) {
    var msg = '';
    if (error.name === 'MongoError' && error.code === 11000)
        msg = '用户名已存在！';
    else {
        msg = error.message.replace('user validation failed', '');
        for (var field in error.errors)
            msg += error.errors[field].message
    }
    return { error: msg }
}

//init-------
let admin = {
    username: 'admin',
    password: 'qwe',
    role: 'admin'
}
user.findOne(admin, function (err, doc) {
    if (!doc)
        user.create(admin)
})
//-----------



module.exports = user;
