const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

const PORT = 5000;
var r1 = [];
var r2 = [];
var r3 = [];

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
app.all('*', (req, res) => {
    res.status(404).send('resource not found');
});

setRoom = (skt, room, arr) => {
    skt.on('connection', (socket) => {
        console.log(socket.id + ' entered ' + room);
    
        arr.push(socket.id);console.log(room + " : ", arr);
        socket.join(room);
    
        socket.on('message', (data) => {
            console.log(data);
            skt.to(room).emit('message', 'server reply to ' + room);
            // socket.emit('message', 'server reply to ' + room);  // bck to clinet requested
        });
    
        socket.on('disconnect', () => {
            console.log(socket.id + ' left ' + room);
            
            socket.leave(room);

            let i = arr.indexOf(socket);
            arr.splice(i, 1);
        });
    });
}

const room1 = io.of('/room_1');
setRoom(room1, 'room_1', r1);
const room2 = io.of('/room_2');
setRoom(room2, 'room_2', r2);
const room3 = io.of('/room_3');
setRoom(room3, 'room_3', r3);


server.listen(PORT, () => {
    console.log('server listening on port '+PORT);
});