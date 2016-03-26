'use strict'
var express = require('express'),
    app = express(),
    middleware = require('./middleware'),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('pingo', (msg) => io.emit('ping', msg))
})

app.get('/', (req, res) =>  res.render('index'))

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), () => console.log('Application listening on port', app.get('port')))
