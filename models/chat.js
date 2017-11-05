var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var chat_schema = {
	sender: String ,
	chatroom: String,
	message: String
}

module.exports = mongoose.model("Chat", chat_schema);