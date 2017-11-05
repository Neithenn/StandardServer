var express = require('express');
var jwt = require('jsonwebtoken');
var auth = require('../middlewares/auth');
var apiRoutes = express.Router(); 
var User = require("../models/user");
var app = express();
var config = require('../config');

app.set('superSecret', config.secret);

apiRoutes.post('/api/authenticate', function(req, res) {
	User.findOne({
		email: req.body.user.email
	}, function(err, user){

		if (err) throw err;

		if (!user){
			//res.json({success: false, message: 'No encontramos tu usuario registrado!'});
			//Crear nuevo usuario
			var newUser = new User(req.body.user);
			newUser.save(function(err, user2){
				if(err) throw err;
				var token = jwt.sign(newUser, app.get('superSecret'),{

				});

				  res.json({
			          success: true,
			          uid: user2._id,
			          token: token
			        });	
				})

		}else if (user){
			console.log(user);
			var token = jwt.sign(user, app.get('superSecret'),{

			});

			  res.json({
		          success: true,
		          uid: user._id,
		          token: token
		        });	
		}

	})
})

	apiRoutes.get('/api/getusers',auth, function(req,res){
		User.find({},function(err, users){
			var userMap = {};
			  users.forEach(function(user) {
			      userMap[user.email] = user;
			    });
			  var users_list = {};
			  users_list.list = userMap;
    		res.send(users_list);  
		})
	})

	apiRoutes.get('/api/testToken',auth, function(req, res){
		res.json({
			msg: 'token funciona'
		})
	})


	//app.use('/api', apiRoutes);
	module.exports = apiRoutes;