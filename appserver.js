// http://jilles.me/getting-the-express-app-js/
//if it doesn't work run express app in app.js


var express = require('express');
var path = require('path');
//var app = express(); use this or line 17


myapp.configure(function() {
myapp.use(express.logger('dev'));
myapp.use(express.bodyParser());
myapp.use(express.static(path.join(__dirname, 'stuff'))); //puts things in stuff folder
});

//socket stuff from http://socket.io/docs/

var app = require('express')();
var server = require('http').createServer(app).listen(3000);
var io = require('socket.io').listen(server);

//server.listen(3000);

io.sockets.on('connection', function (socket) {
    socket.emit('connects', {message: "connected!" });
    console.log('conneted');
    
    socket.on('newGame', function(socket) {
        //do stuff here
        newGameDone();
    });
});

//allows you to actually open app in browser
//127.0.0.1:3000 after you do node app.js or 8888 or 80

fucntion newGameDone() {
    socket.emit('newGame', {game: '9321'});
}

