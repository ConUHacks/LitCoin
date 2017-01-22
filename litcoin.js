var io;
var loopIntervalID = -1;
var endCountDownLoopID = -1;
var isInitialized = false;
/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket) {

  io = sio;
  gameSocket = socket;
  gameSocket.pingTimeout = 3000;
  gameSocket.reconnection = false;
  gameSocket.emit('connected', BOUND, TRACK_LENGTH);
  //randomly decide if user is good or evil

  numPlayers++;
  console.log('numplayers:' + numPlayers);
  io.sockets.emit('giveNumPlayers', numPlayers);
  // Host Events
  //gameSocket.on('IAmReadyToPlay', hostReady);
  gameSocket.on('CoordinateData', updateDataToServer);
  gameSocket.on('RequestTeam', function() {
    gameSocket.emit('goodEvil', Math.random());
    console.log('team requested');
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
    console.log('initializing...numplayers:' + numPlayers);
    obstacleArray = [];
    generateObstacleArray(OBSTACLE_SPACING);
    isInitialized = true;
    gameState = GAME_IN_PROGRESS;
    xPos = 0;
    yPos = 0;
    velocity = 0;
    io.sockets.emit('NewGame');
    clearInterval(loopIntervalID);
    loopIntervalID = setInterval(gameloop, timeInterval);

  }
}



// Game Logic

//course variables
const BOUND = 400; //distance from center that counts as out of bounds

const TRACK_LENGTH = 4000;

const CAR_WIDTH = 20;
const CAR_HEIGHT = 35;
const OBSTACLE_SPACING = 375;


//game states
const GAME_IN_PROGRESS = 1;
const GAME_OVER_WON = 2;
const GAME_OVER_LOST = 3;

//obstacle class def
var Obstacle = function(leftBound, size, yLocation) {
  this.leftBound = leftBound;
  this.rightBound = leftBound + size;
  this.yLocation = yLocation;
}

Obstacle.prototype.checkCollision = function() {
  if (xPos > this.leftBound - CAR_WIDTH / 2 && xPos < this.rightBound +
    CAR_WIDTH / 2) {
    if (yPos > this.yLocation && yPos < this.yLocation + CAR_HEIGHT + 80) { //50 is obstacle height - can change later
      return true;
    }
  }
  return false;
};

var xPos = 0.0,
  yPos = 0.0,
  velocity = 0.0; // velocity = left/right speed

var velocityMultiplier = 0.5; //TODO: calibrate this by testing
var playerVelocityInput = 0;
var forwardSpeed = 0.14;
var numPlayers = 0;

var gameState = 1;

var timeInterval = 40;

var obstacleArray = [];

function gameloop() {


  if (gameState != GAME_IN_PROGRESS || !isInitialized) { //if(gameState != GAME_IN_PROGRESS) {


    //  clearInterval(loopIntervalID);

  } else {
    update(timeInterval);

  }
  io.sockets.emit('SendDataToClient', xPos, yPos, getRotationValue(),
    obstacleArray);


}



function updateDataToServer(mouseX, windowWidth) {

//  console.log('Received X coordinate ' + mouseX + " from client!" + windowWidth);
  //  console.log('Current Velocity:' + velocity);
  playerVelocityInput = (mouseX - windowWidth / 2.0) / windowWidth;
  playerVelocityInput = Math.max(-1, Math.min(playerVelocityInput, 1));
  playerVelocityInput *= velocityMultiplier;
  updateVelocity(playerVelocityInput);
  //gameSocket.emit('IHaveReceivedYourCoordinates');

}

function update(deltaTime) {
  updatePosition(deltaTime);
  updateGameStatus(checkCollisions());
}

function updatePosition(deltaTime) {
  xPos += velocity * deltaTime;
  yPos += deltaTime * forwardSpeed;
}

function updateVelocity(newVelocity) { //Adds a player's wheel setting to a moving average, asynchronous
  if (gameState != GAME_IN_PROGRESS) return;
  velocity -= velocity / numPlayers; //Call this once per update interval for each user
  velocity += newVelocity / numPlayers;

}

function updateGameStatus(collisionOccurred) {
  if (yPos > TRACK_LENGTH) {
    gameState = GAME_OVER_WON;
  } else if (collisionOccurred) {
    gameState = GAME_OVER_LOST;
  }


  if (gameState != GAME_IN_PROGRESS) {
    endLoopCounter = 5;
    endCountDownLoopID = setInterval(endLoop, 1000);
  }

}

var endLoopCounter = 5;

function endLoop() {

  if (endLoopCounter == 5) {
    if (gameState == GAME_OVER_WON) {
      io.sockets.emit('GameEnded', true);
    } else if (gameState == GAME_OVER_LOST) {
      io.sockets.emit('GameEnded', false);
    }
  }
  if (endLoopCounter == 3) io.sockets.emit('ReceiveMessage', "New game in: 3",
    1000);
  else if (endLoopCounter == 2) io.sockets.emit('ReceiveMessage',
    "New game in: 2", 1000);
  else if (endLoopCounter == 1) io.sockets.emit('ReceiveMessage',
    "New game in: 1", 1000);
  else if (endLoopCounter == 0) {
    clearInterval(endCountDownLoopID);
    console.log('initializing...numplayers:' + numPlayers);
    obstacleArray = [];
    generateObstacleArray(OBSTACLE_SPACING);

    isInitialized = true;
    gameState = GAME_IN_PROGRESS;
    xPos = 0;
    yPos = 0;
    velocity = 0;
    //randomly decide if user is good or evil
    io.sockets.emit('NewGame');
    clearInterval(loopIntervalID);
    loopIntervalID = setInterval(gameloop, timeInterval);
  }
  endLoopCounter--;

}

function checkCollisions() {
  if (Math.abs(xPos) > BOUND) {
    return true;
  }

  for (i = 0; i < obstacleArray.length; i++) {
    if (obstacleArray[i].checkCollision() == true) {
      return true;
    }
  }

  return false;
}

function getRotationValue() {
  if (velocity == 0) {
    return 0;
  }
  return Math.atan(velocity / forwardSpeed);
}

function generateObstacleArray(spacing) {
  for (i = spacing; i < TRACK_LENGTH; i += spacing) {
    var newSize = 100 +
      Math.random() * BOUND;
    obstacleArray.push(new Obstacle(2 * (Math.random() - 0.5) * BOUND - newSize/2, newSize, i));
  }
}
