'use strict'
var express = require('express'),
    app = express(),
    moment = require('moment'),
    middleware = require('./middleware'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    request = require('superagent'),
    sockets = []

require('superagent-as-promised')(request);

const fetchTodaysSchedule = () => {
  const today = moment(new Date()).format('YYYY-MM-DD')
  return request.get(`http://rest.tv2.no/sports-dw-rest/sport/football/schedule?fromDate=${today}T00%3A00%3A00%2B01%3A00&toDate=${today}T23%3A59%3A00%2B01%3A00`)
}

const excludeFinishedGames = match => {
  return [
    1, //Slutt
    2, //Utsatt
    4, //Etter ekstraomganger
    5, //Etter ordinær tid
    6, //Etter straffespark
    29, //Etter straffer
    49 //Tildelt seier
  ].indexOf(match.matchStatus.id) === -1
}

function poll () {
  fetchTodaysSchedule()
  .then(res => res.body)
  .then(groupByTournament)
  .then(matches => socket.emit('matches', matches))
  .then(() => {
    setTimeout(() => poll(), 5000)
  })
  .catch(err => {
    setTimeout(() => poll(), 5000)
  })
}

poll()

const groupByTournament = schedule => {
  const tournamentIds = schedule.matches
    .filter(excludeFinishedGames)
    .map(m => m.tournament.id)
    .reduce((tournaments, id) => {
      if (tournaments.indexOf(id) === -1) {
        tournaments.push(id);
      }
      return tournaments;
    }, []);

  return tournamentIds
  .map(id => {
    const matches = schedule.matches
    .filter(excludeFinishedGames)
    .filter(m => m.tournament.id === id)
    return {
      id: id,
      name: matches[0].tournament.name,
      matches: matches.map(m => {
        return {
          teamA: m.teamA,
          teamB: m.teamB,
          matchStatus: m.matchStatus.name
        }
      })
    }
  })
}

io.on('connection', (socket) => {

  sockets.push(socket)

  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket), 1)
  })

  fetchTodaysSchedule()
  .then(res => res.body)
  .then(groupByTournament)
  .then(matches => socket.emit('matches', matches))
})

app.get('/', (req, res) =>  res.render('index'))

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), () => console.log('Application listening on port', app.get('port')))
