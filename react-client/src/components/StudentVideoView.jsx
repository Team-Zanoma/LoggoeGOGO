import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import VideoPlayer from './student-video-view/VideoPlayer.jsx'
import TimestampList from './student-video-view/TimestampList.jsx'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class StudentVideo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      timestamps: [],
      startingTimestamp: 0,
      userId: '',
      view: 'timestamps',
      messages: [],
      userInput: ''
    }

    this.getAllTimestamps = this.getAllTimestamps.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.deleteTimestamp = this.deleteTimestamp.bind(this);
    this.changeVideo = this.changeVideo.bind(this);

    this.socket = io.connect();
    this.socket.on('message', (message) => this.getMessage(message));
  }

  componentDidMount(){
    const videoId = this.props.location.videoId;
    this.getUserId(this.props.location.username); 
    this.getAllTimestamps();
  }

  getUserId(user) {
    axios.get('/user/id', {
      params: { user }
    })
      .then((data) => {
        console.log(data.data[0].id)
        this.setState({userId: data.data[0].id})
        this.getAllTimestamps();
      }
    );
  }

  saveTimeStamp(timestamp, comment, radioButtonValue) {
    const user = this.state.userId;
    const videoId = this.props.location.videoId;

    axios.post('/timestamps', {
      params: {
        userId: user,
        videoId: this.props.location.videoId,
        timestamp: timestamp,
        comment: comment,
        radioButtonValue: radioButtonValue
      }
    })
    .then(() => { this.getAllTimestamps() })
  }

  deleteTimestamp(timestamp) {
    const user = this.state.userId;
    const videoId = this.props.location.videoId;

    axios.delete('/timestamps', {
      params: {
        userId: user,
        videoId: this.props.location.videoId,
        timestamp: timestamp
      }
    })
    .then(() => { this.getAllTimestamps() })
    .then(this.setState({ startingTimestamp: this.state.timestamps[0] })) 
  }

  getAllTimestamps() {
    const videoId = this.props.location.videoId;
    
    axios.get('/timestamps', {
      params: {
        videoId: this.props.location.videoId,
        userId: this.state.userId
      }
    })
    .then((data) => { 
      return data.data.map((TS) => TS)})
    .then((TS) => {
      this.setState({timestamps: TS})
    })
  }
  
  changeVideo(timestamp) {
    this.setState({startingTimestamp: timestamp})
  }

  getMessage(message) {
    const videoId = this.props.location.videoId;
    if (message.room === videoId) {
      this.setState({messages: [...this.state.messages, message]})
    }
  } 

  sendMessage(message = 'hey') {
    const videoId = this.props.location.videoId;
    const username = this.props.location.username;
    const mess = {message: message, room: videoId, username: username}
    this.socket.emit('message', mess);
    this.setState({messages: [...this.state.messages, mess]});
  }

  changeView() {
    this.setState({view: this.state.view === 'timestamps' ? 'chat' : 'timestamps'});
  }

  handleUserInput(e) {
    this.setState({userInput: e.target.value})
  }
  
  render() {  
    console.log('studentvideoview state is: ', this.state.userId);

    return (
      <Paper style={style} zDepth={1}>
        <div>
          <div>
            <Paper>
              <VideoPlayer 
                videoId={this.props.location.videoId} 
                startingTimestamp={this.state.startingTimestamp}
                saveTimeStamp={this.saveTimeStamp}/>
            </Paper>
          </div>
          <div>
            <Paper style={paperStyle2}>
              <RaisedButton label={this.state.view === 'timestamps' ? 'chat' : 'timestamps'} 
              onClick={() => {
                this.changeView();
              }}/>
              <TimestampList 
              timestamps={this.state.view === 'timestamps' ? this.state.timestamps : this.state.messages} 
              deleteTimestamp={this.deleteTimestamp}
              changeVideo={this.changeVideo}
              view={this.state.view}
              />
              {this.state.view === 'chat' ? 
              <TextField id='message' placeHolder="message" value={this.state.userInput} 
              onChange={(e) => {
                this.handleUserInput(e);
              }}
              /> : ''}
              {this.state.view === 'chat' ? <RaisedButton label="submit" 
              onClick={() => {
                this.sendMessage(this.state.userInput);
                this.setState({userInput: ''});
              }}
              /> : ''}
            </Paper>
          </div>
        </div>
      </Paper>
    )
  }
}


const style = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
  padding: '30px',
  background: '#D8E4EA',
}

const paperStyle1 = {
  padding: '20px', 
  width: '100%', 
  float: 'left',
}

const paperStyle2 = {
  padding: '20px', 
  width: '30%', 
  float: 'left',
}


export default StudentVideo;