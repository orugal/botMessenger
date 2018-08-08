var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
/*var chistes = require("chistes.json")*/

const APP_TOKEN = 'EAADtPW1uRIMBADPFS7chZAqbJ61nfZCowjIPAClzPWa6TiMZBUHifZCJG98DC7UR9QfPhk3mvE4B4AKS6QE31ZBBAzZBuOJHX3ZCQwzVma8BOO2TLKtDm7q14JT4SZBpYxmuhbaLVBuOZCmsbZBNKBMnXZBwBYvnTlmZBVepuXJaDRnsoQZDZD';

var app = express();
app.use(bodyParser.json());

app.listen(3000,function(){
	console.log("Servidor en el puerto 3000");
});

app.get('/',function(req,res){
	res.send("Hola al mundo en ngrok jojojo");
});

app.get('/webhook',function(req,res){
	
	if(req.query['hub.verify_token'] === 'test_token_robot')
	{
		res.send(req.query['hub.challenge']);
	}
	else
	{
		res.send("no tienes acceso a esta zona");
	}
});

//Esto es lo que responde el webhook de Facebook con los mensajes
/*
{ object: 'page',
  entry:
   [ { id: '107283462760118',
       time: 1533695855254,
       messaging: [Array] } ] }*/

//validar eventos enviados desde Facebook
app.post('/webhook',function(req,res){
	var data = req.body;
	if(data.object == 'page')
	{
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if(messagingEvent.message){
					recibeMensaje(messagingEvent);
				}
			});
		});
		res.sendStatus(200);
	}
});

//esta es la estructura de un mensaje de Facebook Messenger
/*{ sender: { id: '1430799853652503' },
  recipient: { id: '107283462760118' },
  timestamp: 1533696370315,
  message:
   { mid: 'GLuOQpv_CIFGNLZ2-fN5F1aonc-oxS1DxvXrXpOgoSu2a-oGVqHd2HUyWB-8bswGpn7uAXeHtqMC0qtYzIopEQ',
     seq: 102347,
     text: 'Probando' } }*/

function recibeMensaje(event){
	var usuarioEnvia  = event.sender.id;
	var usuarioRecibe = event.recipient.id;
	var mensaje = event.message.text; 
	evaluarMensaje(mensaje,usuarioEnvia);
}

function evaluarMensaje(mensaje,usuario)
{
	var mensajeSalida = '';
	if(contienePalabra(mensaje,'ayuda'))
	{
		mensajeSalida = "Por el momento no te puedo ayudar";
		enviaMensaje(mensajeSalida, usuario);
		//enviaMensaje(mensajeSalida,usuario);
	}
	else if(contienePalabra(mensaje,'dolar'))
	{
		mensajeSalida = "El precio del dolar es: $2.800 :)";
		enviaMensaje(mensajeSalida,usuario);
		//enviaMensaje(mensajeSalida,usuario);
	}
	else if(contienePalabra(mensaje,'chiste'))
	{
		getChiste(function(chiste){
			mensajeSalida = chiste;
			enviaMensaje(mensajeSalida,usuario);
		});
		//enviaMensaje(mensajeSalida,usuario);
	}
	else
	{
		mensajeSalida = "Solo se repetir "+mensaje;
		enviaMensaje(mensajeSalida,usuario);
	}
	
}
//respuesta a Facebook Messenger
function enviaMensaje(mensaje,usuario)
{
	//se debe responder en la misma estructura que Facebook nos envía.
	var messageData = {
		recipient:{
			id:usuario
		},
		message:{
			text:mensaje
		}
	}
	//llamo el api para enviar
	callSendApi(messageData);
}

function enviaMensajeImagen(usuario)
{
	//se debe responder en la misma estructura que Facebook nos envía.
	var messageData = {
		recipient:{
			id:usuario
		},
		message:{
			attachment:{
				type:'image',
				payload:{
					url:'https://i.imgur.com/rC0XcGd.jpg'
				}
			}
		}
	}
	//llamo el api para enviar
	callSendApi(messageData);
}
//funcion que invoca al API de Facebook
function callSendApi(messageData){

	request({
		uri:'https://graph.facebook.com/v2.6/me/messages',
		qs:{access_token:APP_TOKEN},
		method:'POST',
		json:messageData
	},function(error,response,data){
		if(error)
		{
			console.log('No es posible enviar el mensaje');
		}
		else
		{
			console.log('mensaje enviado');
		}
	})
}

function getChiste(callback)
{
	var salida = '';
	request('http://api.icndb.com/jokes/random',function(error,response,data){
		var info = JSON.parse(data);
		//console.log(info)
		//console.log(info.value.joke);
		salida = info.value.joke+" :D";
		callback(salida);
	});
}

function contienePalabra(sentencia,palabra){
	if(sentencia != undefined)
	{
		return sentencia.indexOf(palabra) > -1;
	}
	else
	{
		return -1;
	}
}