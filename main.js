//new app
var app = express();

// Create an hhtp server w/ Node http module
//pass it thru express app, listen on 3000
var server = require('http').createServer(app).listen(3000);

//instantiate socket.io and have it listen on express/http server
var io = require('socket.io').listen(server);

