import React from 'react';

import Paper from 'material-ui/Paper';

class OwnerTimeStamps extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.timeStamps.map((timeStamp, i) => (
          <Paper style={{margin: '20px'}}>
            <div key={i} style={{padding: '20px', display: 'block'}}>
              <div style={{display: 'inline-block'}}>
                <h4 style={{display: 'inline'}}>Timestamp: </h4>{(timeStamp.timestamp / 60 | 0) + ':' + String(timeStamp.timestamp % 60).padStart(2, '0')}
              </div>
              <div style={{display: 'block'}}>
                <h4 style={{display: 'inline'}}>Student: </h4>{timeStamp.name}
              </div>
              <div style={{display: 'block'}}>
              <h4 style={{display: 'inline'}}>Comment: </h4>{timeStamp.comment}
              </div>
            </div>
          </Paper>
        ))}
      </div>   
    )
  }
}

export default OwnerTimeStamps;