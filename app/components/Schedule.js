import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import Tournament from './Tournament'
import Incident from './Incident'
import {updateTournaments, closeIncidents} from '../redux-actions'

class Schedule extends Component {

  componentDidMount () {
    var socket = io();
    socket.on('tournaments', tournaments => this.props.dispatch(updateTournaments(tournaments)))
  }

  render () {
    return (
      <section className='schedule'>
        <ul onClick={() => this.props.dispatch(closeIncidents())}
          className={classNames('incidents', {'open': this.props.showIncidents})}>
            {this.props.incidents && this.props.incidents.length ? this.props.incidents.map(i =>
              <Incident key={i.id} {...i} />
            ) : (
              <li className='incident'><p>Ingen hendelser</p></li>
            )}
        </ul>
        <ul className='tournaments'>{this.props.tournaments.map(t =>
            <Tournament key={t.id} dispatch={this.props.dispatch} {...t} />)}</ul>
      </section>
    )
  }
}

Schedule.propTypes = {
  tournaments: React.PropTypes.array
}

export default connect((state) => state)(Schedule)
