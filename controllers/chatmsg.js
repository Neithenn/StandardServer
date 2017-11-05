var express = require('express');
//var auth = require('../middlewares/auth');
var apiRoutes = express.Router(); 
var app = express();
var config = require('../config');
var Chat = require("../models/chat");
var Chatroom = require("../models/chatroom");

//app.set('superSecret', config.secret);


apiRoutes.get('/api/savedchats', function(req,res){

	console.log('pase por aqui '+  req.query.user_a + req.query.user_b)
	Chatroom.findOne({ 
			$or:[
					{ $and: [{user_a: req.query.user_a, user_b: req.query.user_b}]},
					{ $and: [{user_a: req.query.user_b, user_b: req.query.user_a}]}
				]},
			function(err, doc){
			
				if (err) throw err;
				if (doc){
					Chat.find({chatroom: doc._id}).limit(10).sort({_id: 1}).exec(function(err, docs){
							if (err) throw err;
							if (docs){
								console.log('mensajes viejos enviados');
								res.json(docs);
							}
						})
				}else{
					res.json({error: true});
				}
	});

});

module.exports = apiRoutes;