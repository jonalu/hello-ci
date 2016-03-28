import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import Tournament from './Tournament'
import {updateTournaments} from '../redux-actions'

class Schedule extends Component {

  componentDidMount () {
    var socket = io();
    socket.on('tournaments', tournaments => this.props.dispatch(updateTournaments(tournaments)))
  }

  render () {
    return (
      <section className='schedule'>
        <ul className='tournaments'>{this.props.tournaments.map(t => <Tournament key={t.id} {...t} />)}</ul>
      </section>
    )
  }
}

Schedule.propTypes = {
  tournaments: React.PropTypes.array
}

export default connect((state) => state)(Schedule)
