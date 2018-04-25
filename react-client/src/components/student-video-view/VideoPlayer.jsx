import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import RadioButton from 'material-ui/RadioButton';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';

import VideoPlayerComponent from '../VideoPlayerComponent.jsx';
import './VideoPlayer.css';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      player: null,
      comment: '',
      radioButtonValue: 'unclear',
      windowSize: window.innerWidth
    };

    this.handleChange = this.handleChange.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
  }

  handleRadioButtonChange(event) {
    this.setState({ radioButtonValue: event.target.value });
  }

  handleChange(comment) {
    this.setState({ comment:comment });
  }

  onReady(event) {
    this.setState({ player: event.target });
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

  handleWindowResize = () => {
    this.setState({ windowSize: window.innerWidth });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    const tagsNames = [
      { value: "Unclear" },
      { value: "More Examples" },
      { value: "Too Fast" },
      { value: "Too Slow" }
    ];

    const longLabel = (val) => {
      const style = { width: '23%', display: 'inline-block' };

      if (val !== "More Examples") {
        return style;
      } else {
        style.width = '31%';
        return style;
      }
    };
    const displayRadios = tagsNames.map(
      ({ value }, idx) => (
        <RadioButton
          key={ idx }
          value={ value }
          label={ value }
          style={ longLabel(value) }
        />
      )
    );
    return (
      <div>
        <div className="videoBox">
          <VideoPlayerComponent videoId={ this.props.videoId } />
        </div>
        <div className="commentBox">
          <label>
            <h4>Write a Comment:</h4>
            <AutoComplete 
              dataSource={[]} 
              refs={ 'autocomplete' }
              onUpdateInput={ this.handleChange }
              onNewRequest={ this.saveTimeStamp }
              style={{margin: '5px'}}
            />
            <RaisedButton 
              onClick={this.saveTimeStamp} 
              label="Submit" 
              style={{margin: '5px'}}
            />    
          </label>
          <RadioButtonGroup
            onChange={ this.handleRadioButtonChange }
            name="tags"
            defaultSelected="unclear"
            className="RadioButtonGroup"
          >
            { displayRadios }
          </RadioButtonGroup>
        </div>
      </div>
    );
  }

}

export default VideoPlayer;
