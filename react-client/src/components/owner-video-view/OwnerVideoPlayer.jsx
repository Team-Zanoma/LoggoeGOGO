import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import YouTube from 'react-youtube';
import Paper from 'material-ui/Paper';
import Card, {CardText} from 'material-ui/Card';

class OwnerVideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      videoId: this.props.videoId,
      player: null
    };

    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
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
  
  render() {
    const opts = {
      height: '380px',
      padding: '10px',
      playerVars: {
        autoplay: 0,
        start: this.props.startingTimestamp,
      }
    };

    return (
      <div>
        <div>
          <h2>Current Video</h2>
          <Paper style={style1}>
            <YouTube
              videoId={this.state.videoId}
              opts={opts}
            />
          </Paper>
        </div>

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