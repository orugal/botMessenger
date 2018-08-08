var request = require("request");
var globalMsg = '';
var mensajeSalida = '';
var logica = {

	prueba:function()
	{
		console.log("JOJOJO");
	},
	contienePalabra:function(sentencia,palabra)
	{
		sentencia = normalize(sentencia);
		if(sentencia != undefined)
		{
			return sentencia.toLowerCase().indexOf(palabra) > -1;
		}
		else
		{
			return -1;
		}
	},
	returnMensaje:function(mensaje){
		globalMsg = mensaje;
		return globalMsg;
	},
	evaluarMensaje:function(mensaje,usuario)
	{
		
		if(logica.contienePalabra(mensaje,'ayuda'))
		{
			mensajeSalida = "Por el momento no te puedo ayudar";
			//logica.returnMensaje(mensajeSalida);
		}
		else if(logica.contienePalabra(mensaje,'dolar'))
		{
			mensajeSalida = "El precio del dólar es: $2.800 :)";
			//logica.returnMensaje(mensajeSalida);
		}
		else if(logica.contienePalabra(mensaje,'hola'))
		{
			mensajeSalida = "Bienvenido, ¿en qué le puedo ayudar?";
			//logica.returnMensaje(mensajeSalida);
		}
		else if(logica.contienePalabra(mensaje,'buenos días') || logica.contienePalabra(mensaje,'buenos dias') || logica.contienePalabra(mensaje,'buenas tardes') || logica.contienePalabra(mensaje,'buenas noches'))
		{
			mensajeSalida = "Bienvenido, ¿en qué le puedo ayudar?";
			//logica.returnMensaje(mensajeSalida);
		}
		else if(logica.contienePalabra(mensaje,'chiste'))
		{
			getChiste(function(chiste){
				mensajeSalida = chiste;
				return mensajeSalida;
			});
		}
		else
		{
			mensajeSalida  = "No tengo respuesta para '"+mensaje+" \n\n'";
			mensajeSalida += "Puedes hacer preguntas como: \n\n";
			mensajeSalida += "¿Cuál es el precio del dolar, euro?: \n";
			mensajeSalida += "¿Cuál es el clima de hoy?: \n";
			//logica.returnMensaje(mensajeSalida);
		}
		return mensajeSalida;
	}

}


var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' );
  }
 
})();

function getChiste(callback)
{
	var salida = ':p';
	request('http://api.icndb.com/jokes/random',function(error,response,data){
		var info = JSON.parse(data);
		salida = info.value.joke+" :D";
		return callback(salida);
	});
}

exports.logica = logica;