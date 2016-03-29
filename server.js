'use strict'
import express from "express";
import moment from "moment";
import http from "http";
import socketIo from "socket.io";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import React from "react";
import {renderToString} from "react-dom/server";
import Schedule from "./app/components/Schedule";
import reducer from "./app/redux-reducer";
import {fetchTournaments} from "./app/redux-actions";

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
let sockets = []

io.on('connection', (socket) => {
  sockets.push(socket)
  socket.on('disconnect', () => sockets.splice(sockets.indexOf(socket), 1))
})

app.get('/', (req, res, next) => {
  const store = applyMiddleware(thunk)(createStore)(reducer, {})
  store.dispatch(fetchTournaments())
    .then(() => {
      res.render('index', {
        markup: renderToString(
          <Provider store={store}>
            <Schedule />
          </Provider>),
        dehydratedState: store.getState(),
        title: 'Pling!'
      })
    })
    .catch(err => next(err))
})

app.get('/live', (req, res) => res.render('live'))

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000)

function poll() {
  const store = applyMiddleware(thunk)(createStore)(reducer, {})
  store.dispatch(fetchTournaments())
    .then(() => sockets.forEach(s => s.emit('tournaments', store.getState().tournaments)))
    .then(() => {
      setTimeout(() => poll(), 5000)
    })
    .catch(err => {
      setTimeout(() => poll(), 5000)
    })
}

poll()

server.listen(app.get('port'), () => console.log('Application listening on port', app.get('port')))
