import React, {PropTypes, Component} from 'react'
import Match from './Match'

class Tournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    }
  }

  render () {
    return (
      <li className={`tournament ${this.state.hidden ? 'unselected' : ''}`}>
        <h3 onClick={() => this.setState({hidden: !this.state.hidden})}>{this.props.name}</h3>
        {this.state.hidden ? null : (<ul className='matches'>{this.props.matches.map(m =>
          <Match key={m.id} dispatch={this.props.dispatch} {...m} />)}</ul>)}
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
