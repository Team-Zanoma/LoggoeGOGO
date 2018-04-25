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
  }
}

const style = {
  height: '100%',
  width: '100%',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px',
  background: '#D8E4EA'
}

const style2 = {
  width: '55%', 
  float: 'left', 
  margin: '20px',
}

const style3 = {
  width: '35%', 
  float: 'left', 
  textAlign: 'left', 
  margin: '20px',
  padding: '20px',
}

export default withRouter(OwnerVideo);