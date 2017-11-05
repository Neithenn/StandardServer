var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var chatroom_schema = {
	user_a: String ,
	user_b: String
}

module.exports = mongoose.model("Chatroom", chatroom_schema);