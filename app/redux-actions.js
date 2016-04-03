'use strict'
import moment from 'moment';
import {schedule, eventsByTournamentAndSeason, eventsByMatch, match} from './tv2/restapi-client';

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

export function incidentsFetchFailed() {
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

export function matchInfoFetchFailed() {
  return {
    type: 'FETCH_MATCH_INFO_FAILED'
  }
}

export function matchInfoAndIncidentsReceived() {
  return {
    type: 'RECEIVE_MATCH_INFO_AND_INCIDENTS'
  }
}

export function fetchMatchInfoStart() {
  return {
    type: 'FETCH_MATCH_INFO_START'
  }
}

export function fetchTournaments(day = new Date()) {
  return (dispatch, getState) => {
    return Promise.all([
        schedule(day),
        eventsByTournamentAndSeason(231, 337)
      ])
      .then(res => Object.assign({schedule: res[0], events: res[1]}))
      .then(groupByTournament)
      .then(data => dispatch(updateTournaments(data)))
      .catch(err => {
        console.log('Error fetching todays schedule from API', err.stack)
      })
  }
}

export function fetchMatchIncidents(matchId) {
  return (dispatch, getState) => {
    return eventsByMatch(matchId)
      .then(data => dispatch(incidentsReceived(data)))
      .catch(err => {
        dispatch(incidentsFetchFailed())
        console.log(`Error fetching incidents for match ${matchId}`, err)
      })
  }
}

export function fetchMatchInfo(matchId) {
  return (dispatch, getState) => {
    return match(matchId)
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
        dispatch(fetchMatchIncidents(matchId))
      ])
      .then(res => dispatch(matchInfoAndIncidentsReceived()))
      .catch(err => console.log('err', err))
  }
}

export const groupByTournament = data => {
  const schedule = data.schedule;
  // data.events.push({match: {id: 809424}, time: new Date(), comment: 'For et mål av Solberg Olsen! Fuhre trekker inn i banen og finner kapteinen på rundt 20 meter. Solberg Olsen legger ballen til rette før han skrur den helt oppe i bakre kryss. Klassescoring!', eventType: {id: 3}});
  const events = data.events.filter(e => moment.duration(moment(new Date()).diff(moment(e.time))).asMinutes() < 2); // events siste to min
  console.log('New events', events);
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
      const event = m => {

        const type = (event) => {
          switch (event.eventType.id) {
            case 2:
              return 'yellow-card';
            case 3:
              return 'goal';
            case 1:
            case 15:
              return 'red-card';
            case 10:
              return 'substitution';
            case 1001:
              return 'full-time';
            default:
              return null;
          }
        };

        const text = (event) => {

          switch (event.eventType.id) {
            // case 2:
            //   return 'yellow';
            // case 3:
            //   return 'goal';
            // case 1:
            // case 15:
            //   return 'red';
            case 10:
              if (event.replacing) {
                return `${event.person.lastName} erstatter ${event.replacing.lastName}`;
              } else if (event.person) {
                return `${event.person.lastName} kommer innpå`;
              } else {
                return ''
              }
            default:
              return event.comment || '';
          }
        };

        const matchEvents = events.filter(type).filter(e => e.match.id === m.id);
        const event = matchEvents.length > 0 ? matchEvents[0] : null;

        const out = event ? {
          type: type(event),
          text: text(event)
        } : null;

        if (out) {
          console.log(m.id, out);
        }

        return out;
      };
      return {
        id: id,
        name: matches[0].tournament.name,
        matches: matches.map(m => Object.assign({event: event(m)}, m))
      }
    })
}

export default {updateTournaments}
