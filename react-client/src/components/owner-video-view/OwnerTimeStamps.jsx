import React from 'react';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import {Card, CardHeader, CardText} from 'material-ui/Card';

class OwnerTimeStamps extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

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
  }
}

export default OwnerTimeStamps;