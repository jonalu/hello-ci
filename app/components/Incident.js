import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'

class Incident extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <li className='incident'>
        <span className='time-from-start'>{`${this.props.timeFromStart}.`}</span>
        {this.props.eventType.icon ? (<span className='text-right icon-wrapper'><img src={this.props.eventType.icon} /></span>) : null}
        {this.props.person ? (
          <span className='text-left'>{`${this.props.person.firstName || ''} ${this.props.person.lastName} (${this.props.team.name})`}</span>
        ) : (
          <span className='text-bold text-left'>{`${this.props.eventType.name}`}</span>
        )}
      </li>
    )
  }
}

export default Incident
