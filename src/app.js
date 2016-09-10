var server = require('./server');
var database = require('./database');
var config = require('./config');

database.connect(config.mongodb_url, function () {
    server.start(config.server_port, config.jwt_secret);
})

process.on('uncaughtException', function (err) {
    console.error(err);
});


