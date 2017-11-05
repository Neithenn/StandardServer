const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io').listen(server);

var config = require('./config'); 
var User = require("./models/user");
var Chatroom = require("./models/chatroom");
var Chat = require("./models/chat");

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(config.database); 

//app.use(require('./middlewares/auth'));
app.use(require('./controllers/login'));
app.use(require('./controllers/fcm'));
app.use(require('./controllers/chatmsg'));		

app.get('/normal', function(req,res){
	res.json({
		prueba:'recibido',
		success: true
	})
})

io.on('connection', function(socket){
	console.log("new connection");
	//ingresar a nuevo chat
	socket.on('join:chat', function(participants){
		console.log(participants)
		Chatroom.findOne({ 
			$or:[
					{ $and: [{user_a: participants.user_a, user_b: participants.user_b}]},
					{ $and: [{user_a: participants.user_b, user_b: participants.user_a}]}
				]},
			function(err, doc){
				if (err) throw err
					console.log('resultado :'+ doc);
				if (doc.user_a != undefined){
					console.log('el chat ya existe '+doc._id);
					socket.join(doc._id);


					/*Chat.find({chatroom: doc._id}).limit(10).sort({_id: 1}).exec(function(err, docs){
						if (err) throw err;
						if (docs){
							console.log('mensajes viejos enviados');
							socket.in(doc._id).emit('initial:broadcast', docs);	
						}
					});*/


				}else{
					//crear nuevo chat room
					var newChat = new Chatroom(participants);
					newChat.save(function(err, res){
						if (err) throw err;
						console.log('nuevo chat creado');
					})
				}

			})
	})
	/*
	socket.on('saved:messages', function(participants){
		console.log('solicita mensajes viejos:'+ participants.user_a);
		Chatroom.findOne({ 
			$or:[
					{$and: [{user_a: participants.user_a, user_b: participants.user_b}]},
					{$and: [{user_a: participants.user_b, user_b: participants.user_a}]}
				]},
			function(err, doc){

				if (err) throw err;
					//Le tengo que mandar los msg viejos
					Chat.find({chatroom: doc._id}).limit(10).sort({_id: -1}).exec(function(err, docs){
						if (err) throw err;
						if (docs){
							socket.in(doc._id).emit('initial:broadcast', docs);	
						}
					});
			});
	
	})*/
	//enviar mensaje al otro
	socket.on('send:message', function(msg){
		//el mensaje debe contener: enviador, remitente, mensaje
		//io.sockets.emit('broadcast', msg.msg);
		
		Chatroom.findOne({ 
			$or:[
					{$and: [{user_a: msg.user_a, user_b: msg.user_b}]},
					{$and: [{user_a: msg.user_b, user_b: msg.user_a}]}
				]},
			function(err, doc){
				if (err) throw err;
				console.log('enviar mensaje doc'+ doc);

				//socket.in(doc._id).emit('broadcast', msg.msg);
				//tengo que guardar el msg recibido
				newchat = new Chat({sender: msg.user_a, message: msg.msg, chatroom: doc._id});
				newchat.save(function(err){
					if (err) throw err;
					socket.in(doc._id).emit('broadcast', msg.msg);
				})
			});

	})
})

server.listen(process.env.PORT || 8081, () => {
	console.log('Server Running...');
    })

