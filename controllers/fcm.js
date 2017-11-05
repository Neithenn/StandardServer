var express = require('express');
var auth = require('../middlewares/auth');
var apiRoutes = express.Router();
var User = require("../models/user");
var app = express();
var config = require('../config');
var request = require('request');

app.set('superSecret', config.secret);

apiRoutes.post('/api/setToken', function(req,res){
	
	User.update({email: req.body.email},
		{FCM_token: req.body.token}, function(err){
			if (err){
				res.json({
		        	success: false
		            });	
				}else{
				res.json({
		        	success: true
		            });	
			};


		})
})

apiRoutes.post('/sendNotification', function(req, res){

	//buscar mi email
	console.log(req.body.email);
	User.findOne({
		email: req.body.email
	}, function(err, user){
		if (err) throw err;

		var url = 'https://fcm.googleapis.com/fcm/send';
		var headers = {
			'Content-Type': 'application/json',
			'Authorization': 'key=AAAA7SzAaSM:APA91bE0w2kiqEa2dzx7rjZNwBvYhHC1Z8ZthHeWgsTy6kLjpBjkqWKC09nY6PpH0_ZkZOr34ZQDb8ho-NoSM18RQZvRquojfK4LrsyJwgcLGzV6NM3cRZcMYQkVQ2A8o5Q1LROaVYJp'
		}
		var json =  {
				"notification":{
			    "title":"Notification PRUEBA",
			    "body":"Hola "+ user.email,
			    "sound":"default",
			    "click_action":"FCM_PLUGIN_ACTIVITY",
			    "icon":"fcm_push_icon"
			  },
			  "data":{
			    "param1":"value1",
			    "param2":"value2"
			  },
			    "to": user.FCM_token,
			    "priority":"high",
			    "restricted_package_name":""
			}

			console.log(json);

		request.post({ url: url, json: json, headers: headers },
			function(error,response,body){
				if (!error && response.statusCode == 200) {
         			   console.log(body);
         			   res.json({
		        			success: true
		            	});	
        		}else if(error){
        			console.log('hubo un error: '+error);
        			res.json({
		        	success: false
		            });	
        		}
			}
		);


	})

})

module.exports = apiRoutes;