'use strict'
import moment from "moment";
import request from "superagent";
import superAgentAsPromised from "superagent-as-promised";

superAgentAsPromised(request)

export function updateTournaments(tournaments) {
  return {
    type: 'RECEIVE_TOURNAMENTS',
    tournaments
  }
}

export function incidentsReceived(incidents) {
  return {
    type: 'RECEIVE_INCIDENTS',
    incidents
  }
}

export function incidentsFetchFailed () {
  return {
    type: 'FETCH_INCIDENTS_FAILED'
  }
}

export function closeIncidents() {
  return {
    type: 'CLOSE_INCIDENTS'
  }
}

export function matchInfoReceived(matchInfo) {
  return {
    type: 'RECEIVE_MATCH_INFO',
    matchInfo
  }
}

export function matchInfoFetchFailed () {
  return {
    type: 'FETCH_MATCH_INFO_FAILED'
  }
}

export function matchInfoAndIncidentsReceived () {
  return {
    type: 'RECEIVE_MATCH_INFO_AND_INCIDENTS'
  }
}

export function fetchMatchInfoStart () {
  return {
    type: 'FETCH_MATCH_INFO_START'
  }
}

export function fetchTournaments(day = moment(new Date()).format('YYYY-MM-DD')) {
  return (dispatch, getState) => {
    return request.get(`http://rest.tv2.no/sports-dw-rest/sport/football/schedule?fromDate=${day}T00%3A00%3A00%2B01%3A00&toDate=${day}T23%3A59%3A00%2B01%3A00`)
      .then(res => res.body)
      .then(groupByTournament)
      .then(data => dispatch(updateTournaments(data)))
      .catch(err => {
        console.log('Error fetching todays schedule from API', err)
      })
  }
}

export function fetchIncidents(matchId) {
  return (dispatch, getState) => {
    return request.get(`http://rest.tv2.no/sports-dw-rest/sport/event?matchId=${matchId}&eventTypeId=1%2C2%2C3%2C4%2C8`)
      .then(res => res.body)
      .then(data => dispatch(incidentsReceived(data)))
      .catch(err => {
        dispatch(incidentsFetchFailed())
        console.log(`Error fetching incidents for match ${matchId}`, err)
      })
  }
}

export function fetchMatchInfo(matchId) {
  return (dispatch, getState) => {
    return request.get(`http://rest.tv2.no/sports-dw-rest/sport/match/${matchId}?detailed=false`)
      .then(res => res.body)
      .then(data => dispatch(matchInfoReceived(data)))
      .catch(err => {
        dispatch(matchInfoFetchFailed())
        console.log(`Error fetching match info for match ${matchId}`, err)
      })
  }
}

export function fetchMatchInfoAndIncidents(matchId) {
  return (dispatch, getState) => {
    dispatch(fetchMatchInfoStart())
    return Promise.all([
      dispatch(fetchMatchInfo(matchId)),
      dispatch(fetchIncidents(matchId))
    ])
    .then(res => dispatch(matchInfoAndIncidentsReceived()))
    .catch(err => console.log('err', err))
  }
}

export const groupByTournament = schedule => {
  return schedule.matches
    .map(m => m.tournament.id)
    .reduce((tournaments, id) => {
      if (tournaments.indexOf(id) === -1) {
        tournaments.push(id);
      }
      return tournaments;
    }, [])
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(id => {
      const matches = schedule.matches
        .filter(m => m.tournament.id === id)
      return {
        id: id,
        name: matches[0].tournament.name,
        matches: matches
      }
    })
}


export default {updateTournaments}
