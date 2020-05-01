const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);
const cluster = require('cluster');

cluster.setupMaster({ exec: './minesweeper.js' });

app.use(express.static('public'));

var proc = cluster.fork();
proc.on('message', (payload) => {
  io.sockets.emit('messages', payload);
})

app.get('/', (req, res) => {
  res.send('');
});

io.on('connection', (socket) => {
  proc.send({type: "connect"});
  socket.on('click', (payload) => {
    proc.send({type: "click", payload: payload });
  });
});

server.listen(3000, () => {
  console.log("listening on: *:3000");
});