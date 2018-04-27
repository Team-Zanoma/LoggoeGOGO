import React, { Component } from 'react';
import VideoPlayerComponent from '../VideoPlayerComponent/VideoPlayerComponent.jsx';

class VideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
  }
//register this
  saveTimeStamp(timestamp, comment, radioValue) {
    this.props.saveTimeStamp(timestamp, comment, radioValue);
  }

  render() {
    const testId = this.props.videoId || 'ZK3O402wf1c';
    return (
      <VideoPlayerComponent
        videoId={ testId }
        hasComments={ true }
        hasController={ true }
        saveComment={ this.saveTimeStamp }
      />
    );
  }

}

export default VideoPlayer;
