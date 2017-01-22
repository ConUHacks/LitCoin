
/**
 * All the code relevant to Socket.IO is collected in the IO namespace.
 *
 * @type {{init: Function, bindEvents: Function, onConnected: Function, onNewGameCreated: Function, playerJoinedRoom: Function, beginNewGame: Function, onNewWordData: Function, hostCheckAnswer: Function, gameOver: Function, error: Function}}
 */
var oldAngle = 0;
var turnAccel = 0;
var numPlayers = 0;
var displayingMessage = false;
var good = true;
var displayedMessage = "";
var messageDisplayTime = 1000;
var timeoutFunction;
var messageColor = "#00FF00";
var mouseX = 0;


var IO = {

  bounds: 0,

  trackLength: 0,

  /**
   * This is called when the page is displayed. It connects the Socket.IO client
   * to the Socket.IO server
   */
  init: function() {
    IO.socket = io.connect();
    IO.bindEvents();
  },

  /**
   * While connected, Socket.IO will listen to the following events emitted
   * by the Socket.IO server, then run the appropriate function.
   */
  bindEvents: function() {
    IO.socket.on('connected', IO.onConnected);
    IO.socket.on('IHaveReceivedYourCoordinates', IO.serverReceivedCoord);
    IO.socket.on('GameEnded', IO.gameEnded);
    IO.socket.on('SendDataToClient', IO.updateDataToClient);
    IO.socket.on('giveNumPlayers', IO.updateNumPlayers);
    IO.socket.on('ReceiveMessage', IO.showMessage);
    //IO.socket.on('goodEvil', IO.setGoodEvil);
    IO.socket.on('NewGame', IO.setGoodEvil);
  },

  requestTeam: function() {
    IO.socket.emit('RequestTeam');
  },

  setGoodEvil: function() {
    console.log('Team:' + number);
    var number = Math.random();
    console.log('NewTeam:' + number);
    if (number >= 0.5) {
      good = false;
    } else {
      good = true;
    }
  },

  showMessage: function(receivedMessage, displayTime) {
    displayingMessage = true;
    displayedMessage = receivedMessage;
    messageDisplayTime = displayTime;
    clearTimeout(timeoutFunction);
    timeoutFunction = setTimeout(function() {
      displayingMessage = false;


    }, displayTime);

  },

  updateNumPlayers: function(numPlayersReceived) {
    numPlayers = numPlayersReceived;
  },

  updateDataToClient: function(xPos, yPos, angle, obstacleArray) {
    //console.log('PositionX: ' + xPos);
    //console.log('PositionY: ' + yPos);
    //console.log('Velocity: ' + velocity);
    //console.log(obstacleArray);

    yPos = -yPos;

    //update the drawing
    var canvas = document.getElementById("myCanvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //draw car
    var car = canvas.getContext("2d");
    car.lineWidth = 4;
    car.save();
    var road = car;
    var checker = car;
    var line = car;
    var obstacle = car;

    //road.save();

    road.translate(-xPos + canvas.width / 2,0);

    road.fillStyle = "#222222";
    road.fillRect(-IO.bounds, 0, IO.bounds * 2, window.innerHeight);

    road.translate(0, -yPos + canvas.height * .75);

    for (var i = 0; i < IO.trackLength / 80; i++) {
      line.fillStyle = "#FFFFFF";
      line.fillRect(-10, canvas.height - i * 200, 20, 80);
    }

    var checkSize = IO.bounds / 10;
    var checkLen = checkSize * 4;
    checker.fillStyle = "#000000";
    checker.fillRect(-IO.bounds, -IO.trackLength, IO.bounds * 2,
      checkLen);
    checker.fillStyle = "#FFFFFF";
    for (var row = 0; row < 10; row++) {
      for (var col = 0; col < 4; col++) {
        var whiteRow = 0;
        if (col == 0 || col == 2) {
          whiteRow = row * 2;
        } else {
          whiteRow = row * 2 + 1;
        }
        checker.fillRect(-IO.bounds + whiteRow * checkSize, -IO.trackLength +
          col * checkSize, checkSize, checkSize);
      }
    }


    obstacle.fillStyle = "#777777";
    for (var i = 0; i < obstacleArray.length; i++) {

      obstacle.fillRect(obstacleArray[i].leftBound, -obstacleArray[i].yLocation -
        80, obstacleArray[i].rightBound - obstacleArray[i].leftBound, 80);
    }

    turnAccel = (angle - oldAngle) * 0.2;
    oldAngle += turnAccel;
    //CAR
    car.fillStyle = "#ff0000";
    car.translate(xPos, yPos + 20);
    //car.rotate(-selfOldAngle);
    car.rotate(oldAngle);
    car.translate(-xPos, -yPos + 20);


    car.moveTo(xPos, yPos);
    car.lineTo(xPos + 40, yPos + 40);
    car.lineTo(xPos, yPos - 40);
    car.lineTo(xPos - 40, yPos + 40);

    car.closePath();
    car.fill();
    car.stroke();

    car.restore();

    car.fillStyle = "#000000";
    car.font = "25px Verdana";

    car.fillText(numPlayers + " player(s) online!", window.innerWidth - 252,
      30);
    car.fillStyle = "#66CD00";
    car.fillText(numPlayers + " player(s) online!", window.innerWidth - 250,
      28);

    if (good) {
      car.fillStyle = "#000000";
      car.fillText("Team Good: Steer to the finish.", 20, 30);
      car.fillStyle = "#00FF00";
      car.fillText("Team Good: Steer to the finish.", 18, 28);


    } else {
      car.fillStyle = "#000000";
      car.fillText("Team Evil: Try to crash the car.", 20, 30);
      car.fillStyle = "#FF0000";
      car.fillText("Team Evil: Try to crash the car.", 18, 28);
    }

    car.fillStyle = "white";
    car.fillRect(Math.min(mouseX,window.innerWidth/2),window.innerHeight - 12, Math.abs(mouseX - window.innerWidth/2),12);

    if (displayingMessage) {
      car.font = "96px Arial";
      car.fillStyle = "#000000";

      var messageWidth = car.measureText(displayedMessage).width;
      car.fillText(displayedMessage, (window.innerWidth - messageWidth) / 2,
        203);
      car.fillStyle = messageColor;
      car.fillText(displayedMessage, (window.innerWidth - messageWidth) / 2,
        200);
      // clearTimeout(timeoutFunction);
      // setTimeout(function() {
      //   displayingMessage = false;
      // }, messageDisplayTime);

    }
    //console.log("Player yPos: " + yPos);

  },


  gameEnded(playerWon) {
    if (playerWon == good) {
      messageColor = '#00FF00';
      IO.showMessage('You Win!', 2000);
      console.log('You win!');
    } else {
      messageColor = '#FF0000';
      IO.showMessage('You Lose!', 2000);
      console.log('You lose!');
    }
  }, //TODO: actually end the game, allow user(s) to restart



  /**
   * The client is successfully connected!
   */
  onConnected: function(bounds, trackLength) {
    // Cache a copy of the client's socket.IO session ID on the App
    IO.bounds = bounds;
    IO.trackLength = trackLength;
    //console.log('bounds:' + bounds + " track length:" + trackLength);
    //IO.socket.emit('IAmReadyToPlay');
    document.onmousemove = handleMouseMove;

    function handleMouseMove(event) {
      var dot, eventDoc, doc, body, pageX, pageY;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0);
      }

      // Use event.pageX / event.pageY here

      mouseX = event.pageX;
    }

    setInterval(function() {
      // method to be executed;
      //console.log(mouseX);
      IO.socket.emit('CoordinateData', mouseX, window.innerWidth);
    }, 100);
  },


  /**
   * An error has occurred.
   * @param data
   */
  error: function(data) {
    alert(data.message);
  }

};

IO.init();