const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const spawn = require("child_process").spawn;

const PORT = 3000;

io.on('connection', (socket) => {

	console.log('room1 connected');

	socket.on('cmd', (data) => {
		console.log(data);
		switch(data) {
			case "p1_punchL":
				console.log('wow u punched me');
				spawn('python', ["./keyMapper/keymap.py", 'z']);
				break;
			case "p1_punchR":
				spawn('python', ["./keyMapper/keymap.py", 'x']);
				break;
			case "p1_kickL":
				spawn('python', ["./keyMapper/keymap.py", 'c']);
				break;
			case "p1_kickR":
				spawn('python', ["./keyMapper/keymap.py", 'v']);
				break;
			case "p1_jump":
				spawn('python', ["./keyMapper/keymap.py", 0]);
				break;
			case "p1_crouch":
				spawn('python', ["./keyMapper/keymap.py", 1]);
				break;
			case "p1_left":
				spawn('python', ["./keyMapper/keymap.py", 2]);
				break;
			case "p1_right":
				spawn('python', ["./keyMapper/keymap.py", 3]);
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
