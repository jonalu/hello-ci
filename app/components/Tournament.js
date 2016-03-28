import React, {PropTypes, Component} from 'react'
import Match from './Match'

class Tournament extends Component {
  render () {
    return (
      <li className='tournament'>
        <h3>{this.props.name}</h3>
        <ul className='matches'>{this.props.matches.map(m => <Match key={m.id} {...m} />)}</ul>
      </li>
    )
  }
}

Tournament.propTypes = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  matches: React.PropTypes.array
}

export default Tournament
