'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var user = require('../mongo/user');
var structure = require('../mongo/structure');
var config = require('../config');

exports.start = function (callback) {
    var app = express();
    middleware(app);
    loginRoute(app);
    userRoute(app);
    var server = app.listen(config.server_port);
    console.log(Date(), 'server start')
    callback(null, server)
}


function middleware(app) {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(expressJwt({
        secret: config.jwt_secret
    }).unless({
        path: ['/api/', '/api/login', '/api/project/:project/service/:service/version/:version']
    }));
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError' ||
            err.name === 'TokenExpiredError' ||
            err.name === 'JsonWebTokenError') {
            res.status(401).send({
                error: err.message
            });
        }
    });
}

function loginRoute(app) {
    app.post('/api/login', function (req, res) {
        user.findOne({
            username: req.body.username
        }, function (err, doc) {
            if (err) res.send(user.errMsg(err));
            else if (!doc) res.send({
                error: '用户不存在！'
            });
            else if (doc.password !== req.body.password) res.send({
                error: '密码错误！'
            });
            else jwt.sign(doc, config.jwt_secret, {
                expiresIn: '30m'
            }, function (err, token) {
                res.send(err ? {
                    error: err.message
                } : {
                        username: doc.username,
                        token: token
                    });
            })
        })
    });
    app.post('/api/logout', function (req, res) {
        //
        res.end()
    });
}

function userRoute(app) {
    app.route('/api/user')
        .get(function (req, res) {
            user.find(user.search(req.query.search), function (err, docs) {
                res.send(err ? user.errMsg(err) : docs)
            })
        })
        .post(function (req, res) {
            user.create(req.body, function (err, doc) {
                res.send(err ? user.errMsg(err) : doc)
            })
        })
        .put(function (req, res) {
            let arr = req.body._id
            let update = req.body
            delete update._id
            if (arr && Array.isArray(arr) && arr.length) {
                user.update({
                    _id: {
                        $in: arr
                    }
                }, {
                        $set: update
                    }, {
                        multi: true
                    }, function (err, doc) {
                        res.send(err ? user.errMsg(err) : doc)
                    })
            } else
                res.send({
                    error: '参数错误！'
                })
        })
        .delete(function (req, res) {
            let arr = req.body;
            if (arr && Array.isArray(arr) && arr.length) {
                user.remove({
                    _id: {
                        $in: arr
                    }
                }, function (err, doc) {
                    res.send(err ? user.errMsg(err) : doc)
                })
            } else
                res.send({
                    error: '参数错误！'
                })
        })
}