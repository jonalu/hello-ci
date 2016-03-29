import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'
import {closeIncidents} from '../redux-actions'
import Incidents from './Incidents'
import Lineup from './Lineup'

class MatchInfo extends Component {

  render () {
    return (
      <section
        className={classNames('match-info', {'open': this.props.showIncidents})}
        onClick={() => this.props.dispatch(closeIncidents())}>
        <div className='lineups'>
        {this.props.matchInfo && this.props.matchInfo && this.props.matchInfo.teamA.lineup.length > 0 ? (
          <Lineup team={this.props.matchInfo.teamA} />
        ) : null}
        {this.props.matchInfo && this.props.matchInfo && this.props.matchInfo.teamB.lineup.length > 0 ? (
          <Lineup team={this.props.matchInfo.teamB} />
        ) : null}
        </div>
        <Incidents incidents={this.props.incidents} />
      </section>
    )
  }

}

MatchInfo.propTypes = {
  showIncidents: React.PropTypes.bool
}

export default MatchInfo
