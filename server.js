'use strict'
import express from 'express'
import moment from 'moment'
import http from 'http'
import middleware from './middleware'
import request from 'superagent'
import socketIo from 'socket.io'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import React from 'react'
import {renderToString} from 'react-dom/server'
import superAgentAsPromised from 'superagent-as-promised'
import Schedule from './app/components/Schedule'
import reducer from './app/redux-reducer'

superAgentAsPromised(request)

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
let sockets = []

app.use(express.static('public'))

const fetchTodaysSchedule = () => {
  const today = moment(new Date()).format('YYYY-MM-DD')
  return request.get(`http://rest.tv2.no/sports-dw-rest/sport/football/schedule?fromDate=${today}T00%3A00%3A00%2B01%3A00&toDate=${today}T23%3A59%3A00%2B01%3A00`)
}

const timePlayed = match => {
  const diff = moment.utc(moment(new Date()).diff(match.startTime));
  const t = diff.hours() * 60 + diff.minutes();
  switch (match.matchStatus.id) {
    case 31:
      return t;
    case 34:
      return t - 15;
    default:
      return 0;
  }
};

function poll () {
  fetchTodaysSchedule()
  .then(res => res.body)
  .then(groupByTournament)
  .then(matches => sockets.forEach(s => s.emit('matches', matches)))
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
    .filter(m => m.tournament.id === id)
    return {
      id: id,
      name: matches[0].tournament.name,
      matches: matches.map(m => {
        return {
          teamA: m.teamA,
          teamB: m.teamB,
          matchStatus: m.matchStatus,
          startTime: moment(m.startTime).format('HH:mm'),
          playTime: timePlayed(m)
        }
      })
    }
  })
}

io.on('connection', (socket) => {
  sockets.push(socket)
  socket.on('disconnect', () => sockets.splice(sockets.indexOf(socket), 1))
  fetchTodaysSchedule()
  .then(res => res.body)
  .then(groupByTournament)
  .then(matches => socket.emit('matches', matches))
})

app.get('/', (req, res, next) => {
  fetchTodaysSchedule()
  .then(res => res.body)
  .then(groupByTournament)
  .then(tournaments => {
    const middleware = [thunk]
    const store = applyMiddleware(...middleware)(createStore)(reducer, {
      tournaments: tournaments
    })
    res.locals.tournaments = tournaments
    res.render('index', {
      markup: renderToString(
        <Provider store={store}>
          <Schedule />
        </Provider>),
      dehydratedState: store.getState()
    })
  })
  .catch(err => next(err))
})

app.get('/live', (req, res) =>  res.render('live'))

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), () => console.log('Application listening on port', app.get('port')))
