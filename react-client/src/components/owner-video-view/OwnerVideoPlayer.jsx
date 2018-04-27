import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Card, {CardText} from 'material-ui/Card';

import YouTube from 'react-youtube';

class OwnerVideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      videoId: this.props.videoId,
      player: null,
      open: false
    };

    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleRequestOpen = this.handleRequestOpen.bind(this);
  }

  componentDidMount() {
    axios.post('/chatMessages', {videoId: this.props.videoId})
    .then(analytics => {
      console.log(analytics);
    })
    .catch(err => {
      console.log(err);
    })
  }

  onReady(event) {
    this.setState({
      player: event.target,
    });
  }
  
  onPlayVideo() {
    this.state.player.playVideo();
  }

  onPauseVideo() {
    this.state.player.pauseVideo();
  }


  saveTimeStamp() {
    const timestamp = Math.floor(this.state.player.getCurrentTime());
    this.props.saveTimeStamp(timestamp);
  }
  
  handleRequestClose() {
    this.setState({
      open: false
    })
  }

  handleRequestOpen() {
    this.setState({
      open: true
    })
  }

  render() {
    const options = {
      height: '200px',
      width: '265px',
      padding: '10px',
      playerVars: {
        autoplay: 0,
        start: this.props.startingTimestamp,
      }
    };

    return (
      <div>
        <div>
          <h2 onClick={this.handleRequestOpen} >Current Video</h2>
          <Paper style={style1}>
            <YouTube
              videoId={this.state.videoId}
              opts={options}
            />
          </Paper>
        </div>
          <Snackbar
            open={this.state.open}
            style={{textAlign: 'center'}}
            message="Comment Added To Database"
            autoHideDuration={2000}
            onRequestClose={this.handleRequestClose}
          />
      </div>
    );
  }
}

const style1 = {
  width: '100%',
  padding: '10px',
  display: 'inline-block',
};



export default OwnerVideoPlayer;