const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io1 = require('socket.io')(server, { cors: { origin: "*" } });
const io2 = require("socket.io-client");

const PORT = 3000;

var host_server = io1.of('/host_server');
var stream = io1.of('/stream');
stream.on('connection', (socket) => {
	socket.on('answer', (answer) => {  // from stream page
		host_server.emit('pass_ answer', answer);
	});

	socket.on('candidate', (candidate) => {
		console.log('[webRTC] candidate sent');
		host_server.emit('pass_candidate', candidate);
	});
});


app.get('/stream_page', (req, res) => {
    res.sendFile(__dirname + '/views/stream_page.html');
});

const flask_server = 'http://localhost:8000';
var socketF = io2.connect(flask_server);
socketF.on('connect', function () {
    console.log('GameServer connected to Flask');
});



host_server.on('connection', (socket) => {
	socket.on('message', (message) => {
		console.log(message);
	});

	socket.on('cmd', (data) => {
		console.log(data);
		
		switch(data) {
			case "p1_undef":
				socketF.emit('key_execute', '-1')
				break;
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
				socketF.emit('key_execute', '0')
				break;
			case "p1_crouch":
				socketF.emit('key_execute', '1')
				break;
			case "p1_moveL":
				socketF.emit('key_execute', '2')
				break;
			case "p1_moveR":
				socketF.emit('key_execute', '3')
				break;
			case "p1_powerL":
				socketF.emit('key_execute', 'a')
				break;
			case "p1_powerR":
				socketF.emit('key_execute', 's')
				break;
			case "p1_skill1L":
				socketF.emit('key_execute', 'p1_skill1L')
				break;
			case "p1_skill1R":
				socketF.emit('key_execute', 'p1_skill1R')
				break;

			case "p2_punchL":
				socketF.emit('key_execute', 'g')
				break;
			case "p2_punchR":
				socketF.emit('key_execute', 'h')
				break;
			case "p2_kickL":
				socketF.emit('key_execute', 'j')
				break;
			case "p2_kickR":
				socketF.emit('key_execute', 'k')
				break;
			case "p2_jump":
				socketF.emit('key_execute', '8')
				break;
			case "p2_crouch":
				socketF.emit('key_execute', '5')
				break;
			case "p2_moveL":
				socketF.emit('key_execute', '4')
				break;
			case "p2_moveR":
				socketF.emit('key_execute', '6')
				break;
			case "p2_powerL":
				socketF.emit('key_execute', 'y')
				break;
			case "p2_powerR":
				socketF.emit('key_execute', 'u')
				break;
			case "p2_skill1":
				socketF.emit('key_execute', 'p2_skill1')
				break;
		}
	});


	// when server receives an offer hand it(SDP) over to the target, A -> B
	socket.on('pass_offer', (offer, id) => {
		console.log('[webRTC] offer received');
		stream.emit('offer', offer, id);
	});
	// ice candiates to be agreed between A and B
	socket.on('pass_candidate', (candidate, id) => {
		stream.emit('candidate', candidate, id);
	});
	socket.on('webRTC_leave', (id) => {
		stream.emit('webRTC_leave', id);
	});

	socket.on('disconnect', () => {
		console.log('host server room1 disconnected');
	});
});

server.listen(PORT, () => {
    console.log('server listening on port '+PORT);
});
