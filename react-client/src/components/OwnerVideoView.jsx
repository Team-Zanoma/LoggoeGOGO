import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import OwnerVideoPlayer from './owner-video-view/OwnerVideoPlayer.jsx';
import OwnerTimeStamps from './owner-video-view/OwnerTimeStamps.jsx';
import Analytics from './owner-video-view/Analytics.jsx';
import Paper from 'material-ui/Paper';


class OwnerVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamps: []
    }
  }

  componentDidMount() {
    this.showTimestamps();
  }

  showTimestamps() {
    axios.get('/timestamps/owner', {params: {videoId: this.props.location.video.videoId}})
    .then((data) => {
      const timeStamps = data.data.sort((a, b)=> a.timestamp - b.timestamp)
      this.setState({timeStamps: timeStamps})
    })
  }

  render() {
    return (
      <Paper>
        <Paper style={style1}>
          {!!this.props.location.video && <OwnerVideoPlayer videoId={this.props.location.video.videoId}/>}
        </Paper>
        <Paper style={style2}>
          {this.state.timeStamps.length !== 0 && <Analytics timeStamps={this.state.timeStamps} video={this.props.location.video}/>}

        </Paper>
        <Paper style={style3}>
            <div>
              {this.state.timeStamps.length !== 0 && <OwnerTimeStamps timeStamps={this.state.timeStamps}/>}
            </div>
        </Paper>
      </Paper>

    )
  }
}

const style1 = {
  height: '100%',
  width: '100%',
  margin: '10px',
  textAlign: 'left',
  display: 'block',
  padding: '30px',
  background: '#666699'
}

const style2 = {
  height: '100%',
  width: '100%',
  margin: '10px',
  textAlign: 'left',
  display: 'block',
  padding: '30px',
  background: '#88CC88'
}

const style3 = {
  height: '100%',
  width: '100%',
  margin: '10px',
  textAlign: 'left',
  display: 'block',
  padding: '30px',
  background: '#EE6666'
}

export default withRouter(OwnerVideo);

/*
return (
  <Paper style={style} zDepth={1}>
    <div style={{display: 'inline-block'}}>
        <div style={style2}>
          <Paper style={{padding: '20px'}}>
            <div>
              {!!this.props.location.video && <OwnerVideoPlayer videoId={this.props.location.video.videoId}/>}
            </div>
          </Paper>
          <br/>
          <Paper style={{padding: '20px'}}>
            <div>
              {this.state.timeStamps.length !== 0 && <Analytics timeStamps={this.state.timeStamps} video={this.props.location.video}/>}
            </div>
          </Paper>
        </div>
        <Paper style={style3}>
          <div>
            {this.state.timeStamps.length !== 0 && <OwnerTimeStamps timeStamps={this.state.timeStamps}/>}
          </div>
        </Paper>
    </div>  
  </Paper>
)
*/