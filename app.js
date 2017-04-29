var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));

board = [];
id = 0;
allClients = [];

app.get('/', function(req, res){
  res.render('/index.html');
});

io.on('connection', function (socket) {
  id += 1;
  allClients.push(socket);
  board.push([0, 0, id])
  io.emit("playerConnected", [board, id]);
  socket.on('sendData', function(data) {
    io.emit('dataReceived', data);
  })
  socket.on('disconnect', function() {
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
    io.emit("remove", board[i][2])
    board.splice(i, 1);
  })
  socket.on('changePlayerPosition', function(data) {
    var i = allClients.indexOf(socket);
    board[i][0] = data[0];
    board[i][1] = data[1];
    io.emit('playerChanged', data);
  })
});

server.listen(process.env.PORT || 8080);
console.log("Multiplayer app listening on port 8080");
