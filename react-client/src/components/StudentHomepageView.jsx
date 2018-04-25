import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import VideoList from './student-homepage-view/VideoListView.jsx';
import Search from './owner-homepage-view/Search.jsx';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

class StudentHomepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            videoList: [],
        }
        this.sendToSelectedVideo = this.sendToSelectedVideo.bind(this);
        this.searchUserVideos = this.searchUserVideos.bind(this);
    }

    componentDidMount() {
      this.getVideos(); 
    }

    getVideos() {
      axios.get('/student/homepage')
      .then((response) => this.setState({videoList: response.data})); 
    }

    sendToSelectedVideo(videoId) {
        this.props.history.push({
            pathname: '/student/video',
            videoId: videoId,
            username: this.props.location.username
          })
    }

    searchUserVideos(query) {
      if (query === '') {
        this.getVideos();
      }
      query = query.toLowerCase();
      const matches = [];
      this.state.videoList.forEach(video => {
        let title = video.title.toLowerCase();
        let description = video.description.toLowerCase();
        if (description.indexOf(query) > -1 || title.indexOf(query) > -1) {
          matches.push(video);
        }
      })
      this.setState({videoList: matches})
    }

    // componentDidMount() {
    //   let recievedMessage = this.props.location.state.message;
    // }

    render() {
      // console.log(recievedMessage);
        return (
            <Paper style={style} zDepth={1}>
                <div>
                    <Paper 
                        style={searchStyle} 
                        zDepth={1}>  
                        <Search view="home" searchUserVideos={this.searchUserVideos} getVideos={() => {}}/>
                    </Paper>
                    <VideoList 
                        videos={this.state.videoList} 
                        redirect={this.sendToSelectedVideo}/>
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
  const searchStyle = {
    height: '100%',
    width: 'auto',
    margin: '20px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px'
  }

export default withRouter(StudentHomepage);