import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import VideoPlayer from './student-video-view/VideoPlayer.jsx';
import TimestampList from './student-video-view/TimestampList.jsx';
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
      slideIndex: 0
    }

    this.getAllTimestamps = this.getAllTimestamps.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.deleteTimestamp = this.deleteTimestamp.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.makeNote = this.makeNote.bind(this);
    this.getUserId = this.getUserId.bind(this);

    this.socket = io.connect();
    this.socket.on('message', (message) => this.getMessage(message));
  }

  componentDidMount(){
    this.authenticate();
    const videoId = this.props.location.videoId;
  }

  authenticate() {
    axios.get('/auth')
    .then(resp => {
      this.getUserId(resp.data); 
    })
  }

  storeVideoId() {
    axios.post('/videoId')
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
  }

  getUserId(user) {
    axios.get('/user/id', {
      params: { user }
    })
      .then((data) => {
        this.setState({ userId: data.data[0].id })
        console.log('id', data.data[0].id)
        this.getAllTimestamps();
        this.getNotes();
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

  sendMessage(message) {
    const videoId = this.props.location.videoId;
    const username = this.props.location.username;
    const mess = {message: message, room: videoId, username: username}
    this.socket.emit('message', mess);
    this.setState({messages: [...this.state.messages, mess]});
  }

  getNotes(callback) { // gets called inside getUserId function above, we need the userId before we can get the notes
    axios.post('/userNotes', { userId: this.state.userId, videoId: this.props.location.videoId })
    .then(notes => {
      callback(notes);
    })
    .catch(err => {
      console.error(err);
    })
  }

  makeNote(note) { // gets called in VideoComments on submit
    axios.post('/notes', { note: note, userId: this.state.userId, videoId: this.props.location.videoId })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    })
  }

  handleTabChange(value) {
    this.setState({
      slideIndex: value,
      // view: this.state.view === 'timestamps' ? 'chat' : 'timestamps'
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
              makeNote={ this.makeNote }
              getNotes={this.getNotes}
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
                  timestamps={this.state.view === 'timestamps' ? this.state.timestamps : this.state.messages} 
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