var io = require('socket.io')(8081);

io.on('connection', function(socket){

	socket.on('message', function(msg){
		socket.in(msg).emit('message', msg);
	})



})