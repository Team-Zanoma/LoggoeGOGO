import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import VideoPlayer from './student-video-view/VideoPlayer.jsx'
import TimestampList from './student-video-view/TimestampList.jsx'
import ChatList from './student-video-view/ChatList.jsx';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import SwipeableViews from 'react-swipeable-views';

import './StudentVideoView.css';

class StudentVideo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      timestamps: [],
      startingTimestamp: 0,
      userId: '',
      view: 'timestamps',
      messages: [],
      userInput: '',
      slideIndex: 0,
    }

    this.getAllTimestamps = this.getAllTimestamps.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.deleteTimestamp = this.deleteTimestamp.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);

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
        this.setState({ userId: data.data[0].id })
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
    .then((data) => data.data.map((TS) => TS))
    .then((TS) => {
      this.setState({ timestamps: TS })
    })
  }
  
  changeVideo(timestamp) {
    this.setState({ startingTimestamp: timestamp })
  }

  getMessage(message) {
    const videoId = this.props.location.videoId;
    if (message.room === videoId) {
      this.setState({ messages: [...this.state.messages, message] })
    }
  } 

  sendMessage(message = 'hey') {
    const videoId = this.props.location.videoId;
    const username = this.props.location.username;
    const mess = {message: message, room: videoId, username: username}
    this.socket.emit('message', mess);
    this.setState({messages: [...this.state.messages, mess]});
  }

  handleTabChange(value) {
    this.setState({
      slideIndex: value,
      view: this.state.view === 'timestamps' ? 'chat' : 'timestamps'
    });
  };

  handleUserInput(e) {
    this.setState({userInput: e.target.value})
  }
  
  render() {  
    return (
      <Paper style={ mainPaper } zDepth={1}>
        <div className="StudentVideoView">
          <Paper style={ videoPaper }>
            <VideoPlayer 
              videoId={ this.props.location.videoId } 
              startingTimestamp={ this.state.startingTimestamp }
              saveTimeStamp={ this.saveTimeStamp }
            />
          </Paper>
          <Paper style={ sideBarPaper }>
            <Tabs
              onChange={ this.handleTabChange }
              value={ this.state.slideIndex }
            >
              <Tab
                label="Questions"
                icon={ <FontIcon className="material-icons">record_voice_over</FontIcon> }
                value={0}
              />
              <Tab
                label="Chat"
                icon={ <FontIcon className="material-icons">chat</FontIcon> }
                value={1}
              />
            </Tabs>
            <SwipeableViews
              index={ this.state.slideIndex }
              onChangeIndex={ this.handleTabChange }
            >
              <div className="slide">
                <TimestampList 
                  timestamps={this.state.timestamps} 
                  deleteTimestamp={this.deleteTimestamp}
                  changeVideo={this.changeVideo}
                  view={this.state.view}
                />
              </div>
              <div className="slide">
                <TextField
                  id='message'
                  placeholder="message"
                  value={ this.state.userInput }
                  onChange={ (e) => this.handleUserInput(e) }
                />
                <RaisedButton
                  label="submit"
                  onClick={ () => {
                    this.sendMessage(this.state.userInput);
                    this.setState({userInput: ''});
                  }}
                />
                <ChatList messages={this.state.messages}/>
              </div>
            </SwipeableViews>
          </Paper>
        </div>
      </Paper>
    )
  }
}

const styles = {
  slide: {
    padding: 10,
  },
};

const mainPaper = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
  padding: '30px',
  background: '#D8E4EA',
}

const videoPaper = {
  width: 'calc(70% - 10px)', 
  float: 'left',
}

const sideBarPaper = {
  width: 'calc(30% - 10px)', 
  float: 'right',
}


export default StudentVideo;