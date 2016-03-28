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

export function closeIncidents() {
  return {
    type: 'CLOSE_INCIDENTS'
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
        console.log(`Error fetching incidents for match ${matchId}`, err)
      })
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
        matches: matches.map(m => {
          return {
            id: m.id,
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

export const timePlayed = match => {
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
}

export default {updateTournaments}
