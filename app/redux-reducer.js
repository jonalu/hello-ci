'use strict'

export function reducer (state = {tournaments: []}, action) {
  switch (action.type) {
    case 'RECEIVE_TOURNAMENTS':
      return { ...state, tournaments: action.tournaments }
    default:
      return state
  }
}

export default reducer
