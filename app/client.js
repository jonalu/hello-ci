'use strict'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import reducer from './redux-reducer'
import Schedule from './components/Schedule'
import thunk from 'redux-thunk'

const middleware = [thunk]
const store = applyMiddleware(...middleware)(createStore)(reducer, window.__dehydratedState)

console.log(document.getElementById('app-container'))

render(
  <Provider store={store}>
    <Schedule />
  </Provider>,
  document.getElementById('app-container')
)
