'use strict'

var async = require('async');
var mongo = require('./mongo');
var redis = require('./redis');
var server = require('./server');
var io = require('./io');


async.waterfall([
    callback => mongo.connect(callback),
    callback => redis.connect(callback),
    callback => server.start(callback),
    (app, callback) => io.start(app, callback),
], err => console.log(Date(), err ? err : '------start------'))


process.on('uncaughtException', err => console.error(err));


