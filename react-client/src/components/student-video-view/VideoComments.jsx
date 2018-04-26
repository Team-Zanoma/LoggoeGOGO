import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import RadioButton from 'material-ui/RadioButton';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import SwipeableViews from 'react-swipeable-views';

import './VideoComments.css';

class VideoComments extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      player: null,
      comment: '',
      radioButtonValue: 'unclear',
      windowSize: window.innerWidth,
      slideIndex: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.sendCommentDetails = this.sendCommentDetails.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
  }

  handleRadioButtonChange(event) {
    this.setState({ radioButtonValue: event.target.value });
  }

  handleTabChange(value) {
    this.setState({ slideIndex: value });
  };


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
      <div>
        <Tabs
          onChange={ this.handleTabChange }
          value={ this.state.slideIndex }
        >
          <Tab
            label="Comment"
            icon={<FontIcon className="material-icons">mode_comment</FontIcon>}
            value={ 0 }
          />
          <Tab
            label="Notes"
            icon={<FontIcon className="material-icons">mode_edit</FontIcon>}
            value={ 1 }
          />
        </Tabs>
        <SwipeableViews
          index={ this.state.slideIndex }
          onChangeIndex={ this.handleTabChange }
        >
          <div>
            <div className="commentBox">
              <label className="inputLabel">
                <h3>Write a Comment:</h3>
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
                  style={{margin: '5px', width: '90px'}}
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
          <div className="slide">
            slide n°2
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default VideoComments;
