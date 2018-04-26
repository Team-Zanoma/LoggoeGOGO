import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import RadioButton from 'material-ui/RadioButton';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';

import './VideoComments.css';

class VideoComments extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      player: null,
      comment: '',
      radioButtonValue: 'unclear',
      windowSize: window.innerWidth,
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendCommentDetails = this.sendCommentDetails.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
  }

  handleRadioButtonChange(event) {
    this.setState({ radioButtonValue: event.target.value });
  }

  handleChange(comment) {
    this.setState({ comment });
  }

  sendCommentDetails() {
    // console.log(this.state.comment, this.state.radioButtonValue)
    this.props.getCommentDetails(this.state.comment, this.state.radioButtonValue);
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
      <div className="commentBox">
        <label>
          <h4>Write a Comment:</h4>
          <AutoComplete 
            id='comments'
            dataSource={[]} 
            refs={ 'autocomplete' }
            onUpdateInput={ this.handleChange }
            onNewRequest={ this.sendCommentDetails }
            style={{margin: '5px'}}
          />
          <RaisedButton 
            onClick={ this.sendCommentDetails } 
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
    );
  }

}

export default VideoComments;
