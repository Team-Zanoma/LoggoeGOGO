import React, { Component } from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import RadioButton from 'material-ui/RadioButton';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import SwipeableViews from 'react-swipeable-views';
import {Card, CardHeader, CardText} from 'material-ui/Card'; 
import Divider from 'material-ui/Divider';

import './VideoComments.css';
import './TimestampListEntry.css'

class VideoComments extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      player: null,
      comment: '',
      radioButtonValue: 'unclear',
      windowSize: window.innerWidth,
      slideIndex: 0,
      note: '',
      notes: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.sendCommentDetails = this.sendCommentDetails.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.makeNote = this.makeNote.bind(this);
    this.showComments = this.showComments.bind(this);
    this.getNotes = this.getNotes.bind(this);
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
    this.props.getCommentDetails(this.state.comment, this.state.radioButtonValue);
  }

  handleNoteChange(note) {
    this.setState({ note });
  }

  makeNote() {
    this.props.makeNote(this.state.note);

    this.setState({
      notes: [...this.state.notes, {body: this.state.note}]
    })
  }

  deleteNote(e) {
    console.log(this.state.userId)
    axios.delete('/notes', { params: { note: e.target.innerText, user: this.state.userId } })
  }

  handleWindowResize() {
    this.setState({ windowSize: window.innerWidth });
  }

  getNotes() {
    this.props.getNotes((notes) => {
      this.setState({
        notes: notes.data
      })
    })
  }
  showComments() {
    var notes = this.state.notes;
    return notes.map((note, index) => {
      return (
        <div>   
          <Card>
            <CardHeader style={{fontWeight: "bold", backgroundColor: "lightgray"}}
              title={'Note ' + (index + 1)}
            />
            <CardText onClick={(e) => this.deleteNote(e)}>
              {note.body}
            </CardText>
          </Card>
          
        </div>
      )
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    setTimeout(() => {this.getNotes()}, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      this.setState({ userId: nextProps.userId });
    }
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
            icon={ <FontIcon className="material-icons">mode_comment</FontIcon> }
            value={ 0 }
          />
          <Tab
            label="Notes"
            icon={ <FontIcon className="material-icons">mode_edit</FontIcon> }
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
            <label className="inputLabel">
              <h3>Write a Note:</h3>
              <AutoComplete 
                id='comments'
                dataSource={[]} 
                refs={ 'autocomplete' }
                onUpdateInput={ this.handleNoteChange }
                style={{margin: '5px'}}
              />
              <RaisedButton 
                onClick={ this.makeNote } 
                label="Submit" 
                style={{margin: '5px', width: '90px'}}
              />    
            </label>
          </div>
        </SwipeableViews>
        <Card style={{backgroundColor: '#676767', margin: '5px 0 5px 0', textAlign: 'center', fontWeight: 'bold'}}>
          <CardText style={{color: 'white', fontSize: '1.25em', fontFamily: 'Arial'}}>
            Your Personal Notes
          </CardText>
        </Card>
        {this.showComments()}
      </div>
    );
  }
}

export default VideoComments;

