'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
exports.connect = function (mongodb_url, callback) {
    mongoose.connect(mongodb_url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console));
    db.once('open', callback);
}


