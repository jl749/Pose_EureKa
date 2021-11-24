const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io1 = require('socket.io')(server, { cors: { origin: "*" } });
const io2 = require("socket.io-client");
const ffmpeg = require('ffmpeg-static');
const { spawn } = require("child_process");

const PORT = 3000;

const flask_server = 'http://localhost:8000';
var socketF = io2.connect(flask_server);
socketF.on('connect', function () {
    console.log('GameServer connected to Flask');
});


var process;
var stream;

io1.on('connection', (socket) => {
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

	socket.on('start_stream', () => {
		console.log('start streaming');
		process = spawn(
			ffmpeg,
			// Linux
			["-video_size", "500x380", "-framerate", "10", "-f", "x11grab", "-i", ":0.0+80,130", '-crf', '0', '-preset', 'ultrafast', '-f', 'mjpeg', '-'],
			// Windows
			// ["-f", "gdigrab", "-framerate", "30", "-i", "desktop", '-crf', '0', '-preset', 'ultrafast', '-f', 'mjpeg', '-'],
			{ stdio: "pipe" }
		);
		
		stream = process.stdout;
		stream.on('data', chunk => {
			const imgStr = Buffer.from(chunk).toString('base64');
			// const imgStr = chunk.toString('base64');
		  
			socket.emit('screen', imgStr);
			// const data = `data:image/png;base64,${imgStr}`;
			// const image = new Image();
			// image.src = data;
			// ctx.drawImage(image, 0, 0);
		});
	});
	socket.on('stop_stream', () => {
		if(process){
			console.log('stop streaming');
			process.kill();
		}
	});

	socket.on('disconnect', () => {
		console.log('host server room1 disconnected');
	});
});

server.listen(PORT, () => {
    console.log('server listening on port '+PORT);
});
