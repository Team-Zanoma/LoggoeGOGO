import React, { Component } from 'react';
import VideoPlayerComponent from '../VideoPlayerComponent/VideoPlayerComponent.jsx';

class VideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
  }

  saveTimeStamp(timestamp, comment, radioValue) {
    console.log('from the video player container: ', timestamp, comment, radioValue);
    // this.props.saveTimeStamp(timestamp, comment, radioValue);
  }

  render() {
    return (
      <VideoPlayerComponent
        videoId={ this.props.videoId }
        hasComments={ true }
        saveComment={ this.saveTimeStamp }
      />
    );
  }

}

export default VideoPlayer;
