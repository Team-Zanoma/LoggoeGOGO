import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';

import './TimestampListEntry.css';

class TimestampListEntry extends Component {
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

  formatTimestamp = (num) => `${(num / 60 | 0)}:${String(num % 60).padStart(2, '0')}`;

  // showCardActions = () => {
  //   return (
  //     view === 'timestamps'
  //     ? (
  //         <CardActions>
  //           <FlatButton onClick={ this.onChangeVideo } label="Watch This Clip" />
  //           <FlatButton onClick={ this.onDeleteTimestamp } label="Delete Question" />
  //         </CardActions>
  //       )
  //     : ( <span><i>{moment().fromNow()}</i></span> )
  //   );
  // }
  
  render() {
    const { timestamp, view, tag } = this.props;
    return (
      <Card style={ style.card }>
        <CardHeader
          title="Issue"
          subtitle={ this.formatTimestamp(timestamp.timestamp) }
          subtitleStyle={ style.sub }
          titleStyle={ style.main }
          className='fixer'
        />
        <CardText>
          { timestamp.comment }
        </CardText>
        <CardActions>
          <FlatButton onClick={ this.onChangeVideo } label="Watch" />
          <FlatButton onClick={ this.onDeleteTimestamp } label="Delete" />
        </CardActions>
      </Card>
    );
  }
}

const style = {
  main: {
    display: 'inline-block',
    float: 'left',
    lineHeight: '21px'
  },
  sub: {
    display: 'inline-block',
    float: 'right',
    lineHeight: '21px'
  },
  card: {
    marginBottom: '10px'
  }
}

export default TimestampListEntry;


// const style = {
//   width: '100%', 
//   padding: '20px', 
//   float: 'left'
// }
      // <Paper style={ style }>
      //   <div>
      //     <h4 style={{display: 'inline'}}>{ view === 'timestamps' ? 'Timestamp' : timestamp.username + ':'} </h4> 
      //     { view === 'timestamps' ? (timestamp.timestamp / 60 | 0) + ':' + String(timestamp.timestamp % 60).padStart(2, '0')
      //       : ''
      //     }
      //   </div>
      //   <div>
      //     <h4 style={{display: 'inline'}}>{ view === 'timestamps' ? 'Comment:' : ''} </h4> 
      //     {view === 'timestamps' ? timestamp.comment : timestamp.message }
      //   </div>
      //   <span><i>{moment().fromNow()}</i></span>
      //   <div>
      //     {view === 'timestamps' ? <button onClick={ this.onChangeVideo }>Watch This Clip</button> : ''}
      //     {view === 'timestamps' ? <button onClick={ this.onDeleteTimestamp }>X</button> : ''}
      //   </div>
      // </Paper>