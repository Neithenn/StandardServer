var express = require('express');
var apiRoutes = express.Router(); 
var firebase = require("firebase");
var User = require("../models/user");
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var setup = {
	apiKey: "AIzaSyC5tkkPfdt-swmIegNIkYseyVfyt9oVSmo",
  	authDomain: "cursando-54cdb.firebaseapp.com",
  	databaseURL: "https://cursando-54cdb.firebaseio.com",
  	storageBucket: "cursando-54cdb.appspot.com"
}
firebase.initializeApp(setup);

apiRoutes.get('/cambiar_password', function(req,res){
	//deberia pasarle el code y el email.
	//Luego cambia la contraseña
	//Debo confirmar si firebase el cod esta bien o no, si todo bien, entonces dejo cambiar, sino error.
	console.log('codigo:' + req.query.oobCode);
	firebase.auth().verifyPasswordResetCode(req.query.oobCode)
	.then(function(email){
		console.log('codigo verificado'+ email);
		res.render('reset_password.ejs', {email: email, code: req.query.oobCode});
	})
	.catch(function(error){
		console.log('no se pudo verificar el codigo'+ error);
	})
})


apiRoutes.post('/actualizar_password',function(req,res){
console.log(req.body.code + req.body.newPassword);
	firebase.auth().confirmPasswordReset(req.body.code, req.body.newPassword)
    .then(function() {
      // Success
      console.log('password modificada');
      //Modificar en la base de datos mongodb
      res.render('changed_password.ejs');
    })
    .catch(function(error) {
    	console.log('un error al confirmar la contraseña'+ error);
      // Invalid code
    })
})

module.exports = apiRoutes;
