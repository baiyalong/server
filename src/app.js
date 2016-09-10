var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('./config');
var db_init = require('./db_init');

var db = null;
MongoClient.connect(config.mongodb_url, function (err, mongodb) {
    if (err) {
        console.log("connect to mongodb failed ! ");
        process.exit();
    }
    // console.log("Connected successfully to mongodb ");
    db = mongodb;
    db_init.init(db);
});



var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(expressJwt({ secret: config.jwt_secret }).unless({ path: ['/login', '/project/:project/service/:service/version/:version'] }));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError' ||
        err.name === 'TokenExpiredError' ||
        err.name === 'JsonWebTokenError') {
        res.status(401).send({ error: err.message });
    }
});

app.get('/',
    function (req, res) {
        res.end();
    })
app.get('/project/:project/service/:service/version/:version',
    function (req, res) {
        res.send(req.params);
    });
app.post('/login',
    function (req, res) {
        var user = {
            username: req.body.username || '',
            password: req.body.password || ''
        }
        db.collection('admin').findOne({ username: user.username }, function (err, admin) {
            if (err) res.send({ error: err.message });
            else if (!admin) res.send({ error: '用户不存在！' });
            else if (admin.password !== user.password) res.send({ error: '密码错误！' });
            else jwt.sign(user, config.jwt_secret, { expiresIn: '30m' }, function (err, token) {
                res.send(err ? { error: err.message } : { token: token });
            })
        })
    });
app.post('/logout',
    function (req, res) {
        //
        res.end();
    });


app.listen(config.server_port, function () {
    console.log('server start ......');
});





