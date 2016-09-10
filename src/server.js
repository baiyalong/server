
var express = require('express');
var bodyParser = require('body-parser');

var auth = require('./auth');
var user = require('./user');
var structure = require('./structure');
var content = require('./content');


exports.start = function (server_port, jwt_secret, db) {

    var app = express();
    app.use(bodyParser.json()); // for parsing application/json




    // auth.route(app, db, jwt_secret)


    app.get('/',
        function (req, res) {
            res.end()
        })



    app.get('/users', function (req, res) {

    })
    app.get('/user/:userId', function (req, res) {

    })
    app.post('/user', function (req, res) {
        user.create(req.body, function (err) {
            user.errMsg(err)
            res.send(err ? { error: err.message } : null)
        })
    })
    // app.update('/user/:userId', function (req, res) {

    // })
    // app.delete('/user/:userId', function (req, res) {

    // })



    app.listen(server_port, function () {
        console.log('server start ......');
    });

    // user.insert({
    //     username: 'ad'
    // }, function (err, res) {
    //     console.log(err)
    //     console.log('------------')
    //     console.log(err.toJSON())
    //     console.log('-------==================-----')
    //     console.log(err.toString())
    // })
}