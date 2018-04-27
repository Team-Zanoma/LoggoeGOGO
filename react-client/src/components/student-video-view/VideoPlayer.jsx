import React, { Component } from 'react';
import VideoPlayerComponent from '../VideoPlayerComponent/VideoPlayerComponent.jsx';

import YouTube from 'react-youtube';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import RadioButton from 'material-ui/RadioButton';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      videoId: this.props.videoId,
      player: null,
      comment: '',
      radioButtonValue: 'unclear',
    };

    this.handleChange = this.handleChange.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
  }

  handleRadioButtonChange(event) {
    this.setState({
      radioButtonValue: event.target.value
    })
  }

  handleChange(comment) {
    this.setState({comment:comment});
  }

  handleChange(comment) {
    this.setState({comment:comment});
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
    this.props.saveTimeStamp(timestamp, this.state.comment, this.state.radioButtonValue);
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
      <div style={{display: 'block', margin: '15px'}}>
        <div>
          <YouTube
            videoId={this.state.videoId}
            opts={opts}
            onReady={this.onReady}
          />
        </div>
        <br/>
        <div>
          <div>
            <RaisedButton 
              onClick={this.onPlayVideo} 
              label="Play" 
              style={{margin: '5px'}}/>
            <RaisedButton 
              onClick={this.onPauseVideo} 
              label="Pause" 
              style={{margin: '5px'}}/>
          </div>
          <label>
            <h4 style={{display: 'inline'}}>Write a Comment: </h4>
            <AutoComplete 
              name='autocomplete'
              id='autocomplete'
              dataSource={[]} 
              refs={'autocomplete'}
              onUpdateInput={this.handleChange}
              onNewRequest={this.saveTimeStamp}
              style = {{margin: '5px'}}/>
            <RaisedButton 
              onClick={this.saveTimeStamp} 
              label="Submit" 
              style={{margin: '5px'}} />
            <RadioButtonGroup onChange={this.handleRadioButtonChange} name="tags" defaultSelected="unclear">
              <RadioButton
                value="unclear"
                label="unclear"
              />
              <RadioButton
                value="needs more examples"
                label="needs more examples"
              />
              <RadioButton
                value="too fast"
                label="too fast"
              />
              <RadioButton
                value="too slow"
                label="too slow"
              />
            </RadioButtonGroup>
    
          </label>
        </div>
      </div>
    );
  }

}

export default VideoPlayer;