'use strict'

export function updateTournaments (tournaments) {
 return {
   type: 'RECEIVE_TOURNAMENTS',
   tournaments
 }
}

export default { updateTournaments }
