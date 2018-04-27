import React from 'react';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import VideoPlayerComponent from '../VideoPlayerComponent/VideoPlayerComponent.jsx';

class OwnerTimeStamps extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // create the list of timestamp items, then render the list
    return (
      <div>
        <h2>Timestamps</h2>
        {this.props.timeStamps.map((timeStamp, i) => (
          <Card key={i + timeStamp} style={{margin: '20px'}}>
            
            <CardHeader 
            style={{backgroundColor: 'grey'}}
            title={'Time: ' + (timeStamp.timestamp / 60 | 0) + ':' + String(timeStamp.timestamp % 60).padStart(2, '0')} 
            subtitle={'name: ' + timeStamp.name}/> 
            <CardText>
    
              <VideoPlayerComponent 
                videoId={this.props.videoId} 
                startingTimestamp={timeStamp.timestamp}
              />
     
              <b>Comment:</b>&nbsp;{timeStamp.comment}
              <br/>
              <strong>Tag:</strong><Chip style={{display: 'inline', backgroundColor: '#999999', margin: '0 0 0 5px', color: 'white'}}>{timeStamp.tag ? timeStamp.tag : 'n/a'}</Chip>
            </CardText>
          </Card>
        ))}
      </div>   
    )
    
  }
}

export default OwnerTimeStamps;

/*
return (
      <div>
        {this.props.timeStamps.map((timeStamp, i) => (
          <Card style={{margin: '20px'}}>
            <CardHeader 
            style={{backgroundColor: 'grey'}}
            title={'Time: ' + (timeStamp.timestamp / 60 | 0) + ':' + String(timeStamp.timestamp % 60).padStart(2, '0')} 
            subtitle={'name: ' + timeStamp.name}/> 
            <CardText>
              <b>Comment:</b>&nbsp;{timeStamp.comment}
              <br/>
              <strong>Tag:</strong><Chip style={{display: 'inline', backgroundColor: '#999999', margin: '0 0 0 5px', color: 'white'}}>{timeStamp.tag ? timeStamp.tag : 'n/a'}</Chip>
            </CardText>
          </Card>
        ))}
      </div>   
    )
    */