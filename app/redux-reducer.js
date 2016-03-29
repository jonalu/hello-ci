'use strict'

export function reducer (state = {tournaments: []}, action) {
  switch (action.type) {
    case 'RECEIVE_TOURNAMENTS':
      return { ...state, tournaments: action.tournaments }
    case 'RECEIVE_INCIDENTS':
      return { ...state, incidents: action.incidents, showIncidents: true }
    case 'CLOSE_INCIDENTS':
      return { ...state, showIncidents: false }
    case 'FETCH_INCIDENTS_FAILED':
      return { ...state, incidents: [] }
    default:
      return state
  }
}

export default reducer
