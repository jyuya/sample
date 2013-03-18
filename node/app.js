/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'MAMO index'
  });
});

app.get('/controls', function(req, res){
  res.render('controls', {
    title: 'MAMO controls'
  });
});

app.get('/image', function(req, res){
  res.render('image', {
    title: 'MAMO image'
  });
});

app.get('/video', function(req, res){
  res.render('video', {
    title: 'MAMO video'
  });
});

// listen

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// 

io.sockets.on('connection', function (socket) {
	socket.emit('load', { message: 'sockets loaded correctly' });
	socket.on('select', function (data) {
		io.sockets.emit('change', { item: data.selected });
	});
});