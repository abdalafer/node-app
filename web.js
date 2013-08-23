var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

server = http.createServer(function(req, res){
   // your normal server code
   var path = url.parse(req.url).pathname;
   switch (path){
       case '/':
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.write('<h1>Hello! Try the <a href="/test.html">Test page</a></h1>');
           res.end();
           break;  
       case '/weather.html':
           fs.readFile(__dirname + path, function(err, data){
               if (err){ 
                   return send404(res);
               }
               res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
               res.write(data, 'utf8');
               res.end();
           });
       case '/pixastic.custom.js':
           fs.readFile(__dirname + path, function(err, data){
               if (err){ 
                   return send404(res);
               }
               res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
               res.write(data, 'utf8');
               res.end();
           });    
    	case '/radar.gif':
           fs.readFile(__dirname + path, function(err, data){
               if (err){ 
                   return send404(res);
               }
               res.writeHead(200, {'Content-Type': path == 'image/gif'});
               res.write(data, 'utf8');
               res.end();
           });   
       break;
       default: send404(res);
   }
}),



send404 = function(res){
   res.writeHead(404);
   res.write('404');
   res.end();
};

server.listen(process.env.PORT || 5000);

// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

// define interactions with client
io.sockets.on('connection', function(socket){
   
   //send data to client 
   //send image url
   	
   /* sends the url of noaa's radar
   socket.emit('radar-image', {'url': 'http://radar.weather.gov/ridge/RadarImg/N0R/AMX_N0R_0.gif?p' + new Date().getTime() });
   
   setInterval(function(){
       socket.emit('radar-image', {'url': 'http://radar.weather.gov/ridge/RadarImg/N0R/AMX_N0R_0.gif?p' + new Date().getTime()});
   }, 300000);
   */
   
 		//get emit initial image for when page is loaded
 		socket.emit('radar-image-file', {'file': "radar.gif" });
 		
		//gets file from noaa's url then saves it locally to then send/emmit it
   	    setInterval(function(){
   	    var file = fs.createWriteStream("radar.gif");
		
		var request = http.get("http://www.abdalafer.com/radar.php", function(response) {
		//var request = http.get("http://radar.weather.gov/ridge/RadarImg/N0R/AMX_N0R_0.gif", function(response) {
 		 response.pipe(file);
		socket.emit('radar-image-file', {'file': "radar.gif" });
		});
		}, 10000);
		
		
		/*
		setInterval(function(){
   		//this reads the radar.gif file and turns it into base64, then emits it.
   		fs.readFile("radar.gif", function(err, data) {
   			var base64data = new Buffer(data).toString('base64');
   			socket.emit('radar-image-file', {'file': base64data });
		});
		}, 5000);
		*/
		
		
		
		
		
   /*
   setInterval(function(){
       socket.emit('radar-image-file', {'url': 'http://radar.weather.gov/ridge/RadarImg/N0R/AMX_N0R_0.gif?p' + new Date().getTime()});
   
   	   var file = fs.createWriteStream("radar.gif");
		var request = http.get("http://radar.weather.gov/ridge/RadarImg/N0R/AMX_N0R_0.gif", function(response) {
 		 response.pipe(file);
		});

   }, 3000);
   */
   

});
