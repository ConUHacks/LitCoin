// http://jilles.me/getting-the-express-app-js/
//if it doesn't work run express app in app.js

var express = require('express');
var path = require('path');
var app = express();

// import game file
var litcoin = require('./litcoin');

// join html css from stuff directory
app.use(express.static(path.join(__dirname, 'stuff')));


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//socket stuff from http://socket.io/docs/
var server = require('http').createServer(app).listen(process.env.PORT || 5000);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level', 1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function(socket) {
    console.log('Someone has connected!');
    litcoin.initGame(io, socket);
});

io.sockets.on('disconnect', function() {
    console.log('Someone has disconnected!');
});