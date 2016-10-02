'use strict'

var mongoose = require('mongoose');
var config = require('./config');

mongoose.Promise = global.Promise;
exports.connect = function (callback) {
    mongoose.connect(config.mongodb_url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console));
    db.once('open', callback);
}


