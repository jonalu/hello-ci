import React, { PropTypes, Component } from 'react'
import Incident from './Incident'

class Incidents extends Component {

  render () {
    return (
      <div className='incidents'>
        <ul>
          {this.props.incidents && this.props.incidents.length ? this.props.incidents.map(i =>
            <Incident key={i.id} {...i} />
          ) : null}
        </ul>
      </div>
    )
  }

}

Incidents.propTypes = {

}

export default Incidents
