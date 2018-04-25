import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import YouTube from 'react-youtube';
import Paper from 'material-ui/Paper';

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
      height: '390',
      width: '500',
      playerVars: {
        autoplay: 1,
        start: this.props.startingTimestamp,
      }
    };

    return (
      <div>
        <div>
          <YouTube
            videoId={this.state.videoId}
            opts={opts}
            onReady={this.onReady}
          />
        </div>
        <div>
          <RaisedButton 
            style={{margin: '5px'}} 
            onClick={this.onPlayVideo}  
            label="Play"/>
          <RaisedButton 
            style={{margin: '5px'}} 
            onClick={this.onPauseVideo} 
            label="Pause"/>
        </div>
      </div>
    );
  }
}


export default OwnerVideoPlayer;