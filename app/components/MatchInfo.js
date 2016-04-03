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
        <Incidents incidents={this.props.incidents} />
        {this.props.matchInfo ? (
          <div className='lineups'>
            <Lineup team={this.props.matchInfo.teamA} />
            <Lineup team={this.props.matchInfo.teamB} />
          </div>
        ) : null}
      </section>
    )
  }

}

MatchInfo.propTypes = {
  showIncidents: React.PropTypes.bool
}

export default MatchInfo
