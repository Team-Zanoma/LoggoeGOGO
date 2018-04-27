import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

class TimestampListEntry extends React.Component {
  constructor(props) {
    super(props)
    
    this.onDeleteTimestamp = this.onDeleteTimestamp.bind(this)
    this.onChangeVideo = this.onChangeVideo.bind(this)
  }

  onChangeVideo() {
    this.props.changeVideo(this.props.timestamp.timestamp)
  }

  onDeleteTimestamp() {
    this.props.deleteTimestamp(this.props.timestamp.timestamp)
  }
  
  render() {
    const { timestamp } = this.props;

    return (
      <Paper style={style}>
        <div>
          <h4 style={{display: 'inline'}}> Timestamp: </h4> 
          { (timestamp.timestamp / 60 | 0) + ':' + String(timestamp.timestamp % 60).padStart(2, '0') }
        </div>
        <div>
          <h4 style={{display: 'inline'}}> timestamps </h4> 
          { timestamp.comment }
        </div>
        <div>
          <button onClick={this.onChangeVideo}>Watch This Clip</button>
          <button onClick={this.onDeleteTimestamp}>X</button>
        </div>
      </Paper>
      );
  }
}

const style = {
  width: '80%', 
  margin: '10px', 
  padding: '20px', 
  float: 'left'
}

export default TimestampListEntry;