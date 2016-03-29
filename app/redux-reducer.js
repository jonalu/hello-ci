'use strict'

export function reducer (state = {tournaments: []}, action) {
  switch (action.type) {
    case 'RECEIVE_TOURNAMENTS':
      return { ...state, tournaments: action.tournaments }
    case 'RECEIVE_INCIDENTS':
      return { ...state, incidents: action.incidents}
    case 'RECEIVE_MATCH_INFO':
      return { ...state, matchInfo: action.matchInfo}
    case 'FETCH_MATCH_INFO_START':
      return { ...state, showIncidents: true }
    case 'CLOSE_INCIDENTS':
      return { ...state, showIncidents: false }
    case 'FETCH_INCIDENTS_FAILED':
      return { ...state, incidents: [] }
    default:
      return state
  }
}

export default reducer
