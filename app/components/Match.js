import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import {fetchMatchInfoAndIncidents} from '../redux-actions';
import moment from 'moment-timezone';

const GAME_STATE = {
  NOT_STARTED: -1,
  FINISHED: 1,
  DELAYED: 2,
  PAUSE: 3,
  EXTRA_TIME: 4,
  PENALTIES: 6,
  FIRST_HALF: 31,
  CANCELED: 32,
  SECOND_HALF: 34,
  HANDED_VICTORY: 49
};

class Match extends Component {
  constructor(props) {
    super(props)
    this.state = {updated: false}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.teamA.score !== nextProps.teamA.score || this.props.teamB.score !== nextProps.teamB.score) {
      this.setState({updated: true}, () => setTimeout(() => this.setState({updated: false}), 10000))
    }
  }

  render() {
    return (
      <li
        onClick={() => this.props.dispatch(fetchMatchInfoAndIncidents(this.props.id))}
        className={classNames('match', {'updated': this.state.updated, 'finished': this.props.matchStatus.id == 1})}>

        {
          this.props.event ? <div className={classNames('alert', this.props.event.type)}>
          <span>
            {this.props.event.text}
          </span>
          </div> : null
        }

        <div className='team-name team-home'>{this.props.teamA.trimmedName}</div>
        <div className='team-goals'>{this.props.teamA.goals}</div>
        <div className='play-time font-small'>{Match.gameState(this.props)}</div>
        <div className='team-goals'>{this.props.teamB.goals}</div>
        <div className='team-name team-away'>{this.props.teamB.trimmedName}</div>
      </li>
    )
  }

  static timePlayed(match, now = new Date()) {
    const minutesSince = (t) => moment(moment(now).diff(t)).minutes();
    switch (match.matchStatus.id) {
      case GAME_STATE.FIRST_HALF:
        return minutesSince(match.realTime.startFirstHalf);
      case GAME_STATE.SECOND_HALF:
        return 45 + minutesSince(match.realTime.startSecondHalf);
      default:
        return 0;
    }
  }

  static gameState(match, now = new Date()) {
    switch (match.matchStatus.id) {
      case GAME_STATE.FIRST_HALF:
      case GAME_STATE.SECOND_HALF:
        return Match.timePlayed(match, now) + '\'';
      case GAME_STATE.FINISHED:
        return 'FT';
      case GAME_STATE.PAUSE:
        return 'HT';
      case GAME_STATE.NOT_STARTED:
        return moment.tz(match.startTime, 'Europe/Oslo').format("HH:mm");
      default:
        return match.matchStatus.shortName.substr(0, 3).toUpperCase();
    }
  }
}

Match.propTypes = {
  teamA: React.PropTypes.object,
  teamB: React.PropTypes.object,
  matchStatus: React.PropTypes.object,
  startTime: React.PropTypes.string
};

export default Match
