'use strict';
import moment from 'moment';
import request from 'superagent';
import superAgentAsPromised from 'superagent-as-promised';

superAgentAsPromised(request);

const sport = 'http://rest.tv2.no/sports-dw-rest/sport';

function fmtDate(moment) {
  return encodeURIComponent(moment.format());
}

export function schedule(date) {
  const from = moment(date).startOf('day').add(8, 'hours');
  const to = from.clone().add(1, 'day');
  return request
    .get(`${sport}/football/schedule?fromDate=${fmtDate(from)}&toDate=${fmtDate(to)}`)
    .then(res => res.body)
}

export function eventsByMatch(matchId) {
  return request
    .get(`${sport}/event?matchId=${matchId}&content=summary&eventTypeId=1003`)
    .then(res => res.body);
}

export function eventsByTournamentAndSeason(tournamentId, seasonId) {
  return request
    .get(`${sport}/event?tournamentId=${tournamentId}&seasonId=${seasonId}&content=summary`)
    .then(res => res.body);
}

export function match(matchId) {
  return request
    .get(`${sport}/match/${matchId}?detailed=false`)
    .then(res => res.body);
}


// export function recentEvents(tournaments) {
//   return Promise
//     .all(tournaments.map(t => eventsByTournamentAndSeason(t.id, t.season)))
//     .then(arr => arr.map(a => a.filter()))
//     .reduce()
// }