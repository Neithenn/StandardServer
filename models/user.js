var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var config = require('../config');

//mongoose.connect(config.database);



var user_schema = new Schema({
	name: String,
	password: String,
	email: String,
	photo: String,
	provider: String,
	role: String,
	FCM_token: String
});


module.exports = mongoose.model("User", user_schema);