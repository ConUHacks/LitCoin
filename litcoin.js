var io;
var isInitialized = false;
//litcoin.js is called by index.js

exports.initGame = function(sio, socket) {

    io = sio;
    gameSocket = socket;
    gameSocket.pingTimeout = 3000;
    gameSocket.reconnection = false;
    gameSocket.emit('connected');
    //give user money
    
    numPlayers++;
    
    console.log('numplayers:' + numPlayers);
    gameSocket.on('MoneyData', function() {
        gameSocket.emit('$1000');
    });
    gameSocket.on('disconnect', function() {
        numPlayers--;
        io.sockets.emit('giveNumPlayers', numPlayers);
        
        console.log('disconnected...numplayers:' + numPlayers);
        if (numPlayers == 0) {
            isInitialized = false;
        }
    });
    
    if (!isInitialized) {
        console.log('initializing...numplayers' + numPlayers);
        
        isInitialized = true;
        gameState = GAME_IN_PROGRESS;
        io.sockets.emit('NewGame');
        clearInterval(loopIntervalID);
        loopIntervalID = setInterval(gameloop, timeInterval);
    }
}        

//game logic

const GAME_IN_PROGRESS = 1;

function gameLoop() {
    
    if (gameState != GAME_IN_PROGRESS || !isInitialized) {
        
    } else {
        update(timeInterval);
        
    }
    
}

