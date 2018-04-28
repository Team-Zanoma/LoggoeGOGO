import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import OwnerVideoPlayer from './owner-video-view/OwnerVideoPlayer.jsx';
import OwnerTimeStamps from './owner-video-view/OwnerTimeStamps.jsx';
import Analytics from './owner-video-view/Analytics.jsx';
import Paper from 'material-ui/Paper';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import SwipeableViews from 'react-swipeable-views';


class OwnerVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamps: [],
      slideIndex: 0,
      videoId: null
    }

  this.handleTabChange = this.handleTabChange.bind(this);
  this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentDidMount() {
    this.storeVideoId();
    this.authenticate();
  }

  authenticate() {
    axios.get('/auth')
    .then(resp => {
      this.setState({ username: resp.data.user, videoId: resp.data.videoId })
      this.showTimestamps();
    })
    .catch(err => {
      console.log(err);
    })
  }

  storeVideoId() {
    const video = this.props.location.video ? this.props.location.video.videoId : false;
    if (!video) return;
    axios.post('/videoId', { videoId: video })
    .then(res => {
      console.log('posted vid');
    })
    .catch(err => {
      console.log(err);
    })
  }

  showTimestamps() {
    const video = this.props.location.video ? this.props.location.video.videoId : false;
    axios.get('/timestamps/owner', {params: {videoId: video || this.state.videoId }})
    .then((data) => {
      const timeStamps = data.data.sort((a, b)=> a.timestamp - b.timestamp)
      this.setState({timeStamps: timeStamps})
    })
  }

  handleTabChange(value) {
    this.setState({
      slideIndex: value
    });
  };

  handleBackButton() {
    this.props.history.push({
      pathname: '/owner',
      username: '',
    })
  }
  

  render() {
    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    };
    
    return (
      <Paper style={ mainPaper }>
        <Paper style={ fullPaper }>
          <button onClick={ this.handleBackButton }>Go Back</button>
        </Paper>
        <Paper style={ chartPaper }>
          <Tabs
            onChange={ this.handleTabChange }
            value={ this.state.slideIndex }
          >
            <Tab
              label="Analytics"
              icon={ <FontIcon className="material-icons">timeline</FontIcon> }
              value={0}
            />
            <Tab
              label="Video"
              icon={ <FontIcon className="material-icons">videocam</FontIcon> }
              value={1}
            />
          </Tabs>
          <SwipeableViews
            index={ this.state.slideIndex }
            onChangeIndex={ this.handleTabChange }
          >
            <div className="slide">
              { this.state.timeStamps.length !== 0 && <Analytics timeStamps={ this.state.timeStamps } video={ this.props.location.video || this.state.videoId }/> }
            </div>
            <div className="slide">
              { !!this.props.location.video && <OwnerVideoPlayer videoId={ this.props.location.video.videoId }/> }
            </div>
          </SwipeableViews>
        </Paper>
        <Paper style={ sideBarVideo }>
          { this.state.timeStamps.length !== 0 && <OwnerTimeStamps timeStamps={ this.state.timeStamps }/> }
        </Paper>
      </Paper>
    )
  }
}


const mainPaper = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
  padding: '30px',
  background: '#D8E4EA',
}

const sideBarVideo = {
  width: 'calc(30% - 10px)', 
  float: 'right',
}

const chartPaper = {
  width: 'calc(70% - 10px)', 
  float: 'left',
}

const fullPaper = {
  width: '100%', 
  float: 'left',
  marginBottom: '20px'
}







const style1 = {
  height: '100%',
  width: '100%',
  margin: '10px',
  textAlign: 'left',
  display: 'block',
  padding: '30px',
  background: 'grey'
}

const style2 = {
  height: '100%',
  width: '100%',
  margin: '10px',
  textAlign: 'left',
  display: 'block',
  padding: '30px',
  background: 'grey'
}

const style3 = {
  height: '100%',
  width: '100%',
  margin: '10px',
  textAlign: 'left',
  display: 'block',
  padding: '30px',
  background: 'grey'
}

export default withRouter(OwnerVideo);
