var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var user = require('./user');


exports.route = function (app, db, jwt_secret) {
    app.use(expressJwt({ secret: jwt_secret }).unless({ path: ['/', '/login', '/project/:project/service/:service/version/:version'] }));
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError' ||
            err.name === 'TokenExpiredError' ||
            err.name === 'JsonWebTokenError') {
            res.status(401).send({ error: err.message });
        }
    });


    app.post('/login', function (req, res) {
        var user = {
            username: req.body.username || '',
            password: req.body.password || ''
        }
        db.collection('user').findOne({ username: user.username }, function (err, doc) {
            if (err) res.send({ error: err.message });
            else if (!doc) res.send({ error: '用户不存在！' });
            else if (doc.password !== user.password) res.send({ error: '密码错误！' });
            else jwt.sign(user, jwt_secret, { expiresIn: '30m' }, function (err, token) {
                res.send(err ? { error: err.message } : { token: token });
            })
        })
    });

    
    app.post('/logout', function (req, res) {
        //
        res.end()
    });
}