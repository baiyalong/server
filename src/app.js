'use strict'

var async = require('async');
var database = require('./database');
var redis = require('./redis');
var server = require('./server');
var io = require('./io');


async.waterfall([
    function (callback) {
        database.connect(callback)
    },
    function (callback) {
        redis.connect(callback)
    },
    function (callback) {
        server.start(callback)
    },
    function (app, callback) {
        io.start(app, callback)
    },
], function (err, res) {
    console.log(err ? err : 'server start ...')
})


process.on('uncaughtException', function (err) {
    console.error(err);
});


