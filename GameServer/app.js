const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

const PORT = 5000;


io.on('connection', (socket) => {
	console.log('room1 connected');

	socket.on('cmd', (data) => {
		console.log(data);
	});

	socket.on('disconnect', () => {
		console.log('room1 disconnected');
	});
});

server.listen(PORT, () => {
    console.log('server listening on port '+PORT);
});
