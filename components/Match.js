import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'

class Match extends Component {
  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    this.setState({ updated: true }, () => this.setState({ updated: false }))
  }
  render () {
    console.log('match render')
    const playTime = this.props.matchStatus.id == 1 ? 'FT' : this.props.playTime > 0 ? `${this.props.playTime} '` : this.props.startTime
    return (
      <li className={classNames('match', {'updated': this.state.updated, 'finished': this.props.matchStatus.id == 1})}>
        <div className='team-name team-home'>{this.props.teamA.name}</div>
        <div className='team-goals'>{this.props.teamA.goals}</div>
        <div className='play-time font-small'>{playTime}</div>
        <div className='team-goals'>{this.props.teamB.goals}</div>
        <div className='team-name team-away'>{this.props.teamB.name}</div>
      </li>
    )
  }
}

Match.propTypes = {
  teamA: React.PropTypes.object,
  teamB: React.PropTypes.object,
  matchStatus: React.PropTypes.object,
  startTime: React.PropTypes.string,
  playTime: React.PropTypes.number
}

export default Match
