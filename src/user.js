
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: [true, '用户名不能为空！'], unique: true },
    password: { type: String, required: [true, '密码不能为空！'] },
    description: String,
    role: { type: String, defalut: 'user', enum: ['user', 'admin'] },
    projects: [Schema.Types.ObjectId]
});

var unique = function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('用户名 ' + doc.username + ' 已存在！'));
    } else {
        next(error);
    }
}
userSchema.post('save', unique);
userSchema.post('update', unique);


var user = mongoose.model('user', userSchema);
user.errMsg = function (error) {
    console.log(error)
    if (error.name === 'ValidationError' && error.errors)
        return error.errors;
    console.log(error)
    return error
}

module.exports = user;





// exports.insert = function (user, callback) {
//     User.create(user, callback)
// }


// exports.initAdmin = function (db) {
//     var admin = {
//         username: 'admin',
//         password: 'qwe'
//     };
//     var user_collection = db.collection('user');
//     user_collection.findOne(admin, function (err, doc) {
//         if (doc === null) user_collection.insertOne(admin);
//     })
// }


// exports.route = function (app, db) {

//     var user_collection = db.collection('user');

//     app.get('/users', function (req, res) {
//         user_collection.find({}).toArray(function (err, docs) {
//             res.send(err ? { error: err.message } : { users: docs })
//         })
//     })

//     app.get('/user/:userId', function (req, res) {
//         user_collection.findOne({ _id: req.userId }, function (err, doc) {
//             res.send(err ? { error: err.message } : { user: doc })
//         })
//     })

//     app.post('/user', function (req, res) {
//         var user = {
//             username: req.body.username || '',
//             password: req.body.password || '',
//             description: req.body.description || ''
//         }
//         if (!user.username) res.send({ error: '用户名不能为空！' })
//         else if (!user.password) res.send({ error: '密码不能为空！' })
//         else user_collection.findOne({ username: user.username }, function (err, doc) {
//             if (err) res.send({ error: err.message })
//             else if (doc) res.send({ error: '用户名重复！' })
//             else user_collection.insertOne(user, function (err) {
//                 if (err) res.send({ error: err.message })
//                 else res.end();
//             })
//         })
//     })

//     app.update('/user/:userId', function (req, res) {
//         var user = req.body;
//         if (!user) res.send({ error: '修改内容不能为空！' })
//         else user_collection.findOne({ _id: req.userId }, function (err, doc) {
//             if (err) res.send({ error: err.message })
//             else if (!doc) res.send({ error: '用户不存在！' })
//             else {
//                 var update = {}
//                 user.username !== doc.username ? update.username = user.username : null;
//             }
//         })

//     })

//     app.delete('/user/:userId', function (req, res) {
//         user_collection.deleteOne({ _id: req.userId }, function (err) {
//             err ? res.send({ error: err.message }) : res.end();
//         })
//     })
// }