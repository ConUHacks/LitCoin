jQuery(function($) {
    'use strict';
    // taken from http://socket.io/docs/
    var numPlayers = 0
    var IO = function() {

        //socket.io connection code
        bounds: 0,
        trackLength: 0

            init: function() {
            IO.socket = io.connect();
            IO.bindEvents();
        },

        bindEvents: function() {
            // checks if connected
            IO.socket.on('connected', IO.onConnected);
            // checks nummber of players
            IO.socket.on('playersOn', IO.updateNumPlayers);
        },

        updateNumPlayers: function(numPlayersReceived) {
            numPlayers = numPlayersReceived;
        },


        onConnected: function(bounds, trackLength) {

            IO.bounds = bounds;
            IO.tracklength = trackLength;
            IO.socket.emit('lesgo hoes');
        }
    };

    IO.init();
}($));