const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io1 = require('socket.io')(server, { cors: { origin: "*" } });
const io2 = require("socket.io-client");

const PORT = 5000;
var r1 = [];
var r2 = [];
var r3 = [];

app.use(express.static('./public'));

app.get('/room_1', (req, res) => {
    // res.render('index');
    res.sendFile(__dirname + '/views/room_1.html');
});
app.get('/room_2', (req, res) => {
    res.sendFile(__dirname + '/views/room_2.html');
});
app.get('/room_3', (req, res) => {
    res.sendFile(__dirname + '/views/room_3.html');
});
app.get('/gameDemo', (req, res) => {
    res.sendFile(__dirname + '/views/jsEmulator.html');
});
app.all('*', (req, res) => {
    res.status(404).send('resource not found');
});

var socket1 = io2.connect('http://192.168.43.146:5000');  // raspberry server 1
socket1.on('connect', function () {
    console.log('host server connected to raspberry game server');
    // socket1.emit('message', 'host server connected to raspberry no.1');
});

setRoom = (skt1, room, arr, skt2) => {
    skt1.on('connection', (socket) => {
        console.log(socket.id + ' entered ' + room);
    
        arr.push(socket.id);console.log(room + " : ", arr);
        socket.join(room);
    
        socket.on('cmd', (data) => {
            console.log(data);
            skt2.emit('cmd', data);  // pass command to game server (raspberry)
            // skt1.to(room).emit('message', 'server reply to ' + room);  // acknowledgement
            // socket.emit('message', 'server reply to ' + room);  // bck to clinet requested
        });
    
        socket.on('disconnect', () => {
            console.log(socket.id + ' left ' + room);
            skt1.to(room).emit('userLeft', socket.id + ' left');  // broadcast everyone in the room

            socket.leave(room);

            let i = arr.indexOf(socket);
            arr.splice(i, 1);
        });
    });
}

const room1 = io1.of('/room_1');
setRoom(room1, 'room_1', r1, socket1);
// const room2 = io1.of('/room_2');
// setRoom(room2, 'room_2', r2);
// const room3 = io1.of('/room_3');
// setRoom(room3, 'room_3', r3);


server.listen(PORT, () => {
    console.log('server listening on port '+PORT);
});