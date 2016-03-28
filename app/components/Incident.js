import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'

class Incident extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {firstName, lastName} = this.props.person
    const {icon} = this.props.eventType
    const teamName = this.props.team.name
    return (
      <li className='incident'>
        <div className='icon-wrapper'><img src={icon} /></div>
        <p>{`${firstName} ${lastName} (${teamName})`}</p>
      </li>
    )
  }
}

export default Incident
