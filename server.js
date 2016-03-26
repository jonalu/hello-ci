'use strict'
var express = require('express'),
    app = express(),
    middleware = require('./middleware'),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

var sockets = []

var request = require('superagent');
require('superagent-as-promised')(request);

function poll () {
  request.get('http://rest.tv2.no:80/sports-dw-rest/sport/event?tournamentId=1%2C230%2C232&seasonId=337&content=summary&max=50')
  .then(res => res.body)
  .then(events => sockets.forEach( socket => socket.emit('events', events)))
  .then(() => {
    setTimeout(() => poll(), 5000)
  })
  .catch(err => {
    setTimeout(() => poll(), 5000)
  })
}

poll()

io.on('connection', (socket) => {

  sockets.push(socket)

  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket), 1)
  })

  request.get('http://rest.tv2.no/sports-dw-rest/sport/schedule?fromDate=2016-03-26T00%3A00%3A00%2B01%3A00&toDate=2016-03-26T23%3A59%3A00%2B01%3A00')
  .then(res => res.body)
  .then(schedule => socket.emit('schedule', schedule))
})

app.get('/', (req, res) =>  res.render('index'))

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), () => console.log('Application listening on port', app.get('port')))
