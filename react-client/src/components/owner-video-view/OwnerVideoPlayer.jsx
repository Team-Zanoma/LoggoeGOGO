import React, { Component } from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';


import VideoPlayerComponent from '../VideoPlayerComponent/VideoPlayerComponent.jsx';

class OwnerVideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
  }

  saveTimeStamp() {
    const timestamp = Math.floor(this.state.player.getCurrentTime());
    this.props.saveTimeStamp(timestamp);
  }
  
  render() {
    return (
      <VideoPlayerComponent
        videoId={ this.props.videoId }
        saveComment={ this.saveTimeStamp }
        hasController={ true }
      />
    );
  }
}

export default OwnerVideoPlayer;