const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io1 = require('socket.io')(server, { cors: { origin: "*" } });
const io2 = require("socket.io-client");

const PORT = 3000;

const flask = 'http://localhost:8000';
var socketF = io2.connect(flask);
socketF.on('connect', function () {
    console.log('GameServer connected to Flask');
});

io1.on('connection', (socket) => {

	console.log('room1 connected');

	socket.on('cmd', (data) => {
		console.log(data);
		
		switch(data) {
			case "p1_punchL":
				socketF.emit('key_execute', 'z')
				break;
			case "p1_punchR":
				socketF.emit('key_execute', 'x')
				break;
			case "p1_kickL":
				socketF.emit('key_execute', 'c')
				break;
			case "p1_kickR":
				socketF.emit('key_execute', 'v')
				break;
			case "p1_jump":
				socketF.emit('key_execute', 0)
				break;
			case "p1_crouch":
				socketF.emit('key_execute', 1)
				break;
			case "p1_left":
				socketF.emit('key_execute', 2)
				break;
			case "p1_right":
				socketF.emit('key_execute', 3)
				break;
		}
	});

	socket.on('disconnect', () => {
		console.log('room1 disconnected');
	});
});

server.listen(PORT, () => {
    console.log('server listening on port '+PORT);
});
