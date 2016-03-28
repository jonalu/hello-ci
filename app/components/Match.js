import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'

class Match extends Component {
  constructor (props) {
    super(props)
    this.state = { updated: false }
  }
  componentWillReceiveProps (nextProps) {
    if(this.props.teamA.score !== nextProps.teamA.score || this.props.teamB.score !== nextProps.teamB.score)
      this.setState({ updated: true }, () => setTimeout(() => this.setState({ updated: false }), 10000))
  }
  shouldComponentUpdate (nextProps, nextState) {
    return this.state.updated !== nextState.updated
  }
  render () {
    const playTime = this.props.matchStatus.id == 1 ? 'FT' : this.props.playTime > 0 ? `${this.props.playTime} '` : this.props.startTime
    return (
      <li
        onClick={this.handleClick.bind(this)}
        className={classNames('match', {'updated': this.state.updated, 'finished': this.props.matchStatus.id == 1})}>
        <div className='team-name team-home'>{this.props.teamA.name}</div>
        <div className='team-goals'>{this.props.teamA.goals}</div>
        <div className='play-time font-small'>{playTime}</div>
        <div className='team-goals'>{this.props.teamB.goals}</div>
        <div className='team-name team-away'>{this.props.teamB.name}</div>
      </li>
    )
  }

  handleClick (event) {
    console.log(this.props)
    event.stopPropagation();
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
