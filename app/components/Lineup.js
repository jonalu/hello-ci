import React, { PropTypes, Component } from 'react'

class Lineup extends Component {

  render () {
    return (
      <div className='lineup'>
        <h3><img src={this.props.team.icon} /></h3>
        <ul>
          {this.props.team.lineup.map((line, i) =>
            <li key={i}><ul>{line.map(player =>
                <li key={player.id}>{`${player.firstName || ''} ${player.lastName}`}</li>)}</ul></li>
          )}
        </ul>
      </div>
    )
  }

}

Lineup.propTypes = {

}

export default Lineup
