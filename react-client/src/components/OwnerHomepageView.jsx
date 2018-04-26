import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import VideoList from './owner-homepage-view/VideoList.jsx';
import Search from './owner-homepage-view/Search.jsx';
import OwnerVideo from './OwnerVideoView.jsx';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class OwnerHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      video: '',
      userId: '',
      view: 'home',
      searchedVideos: []
    }
    this.getVideos = this.getVideos.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.getUserVideos = this.getUserVideos.bind(this);
    this.sendToSelectedVideo = this.sendToSelectedVideo.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.searchUserVideos = this.searchUserVideos.bind(this);
  }

  componentDidMount() {
    this.getUserId(this.props.location.username) 
  }
  
  getVideos(query) {
    axios.get('/owner/search', {params: {query: query, userId: this.state.userId}})
    .then((data) => {
      this.setState({searchedVideos: [...data.data]})
    })
  }

  getUserId(user) {
    axios.get('/user/id', {params: {user: user}})
    .then((data) => {
      this.setState({userId: data.data[0].id}, ()=> this.getUserVideos(data.data[0].id));
    })
  }

  getUserVideos(userId) {
    axios.get('/owner/videoList', {params: {userId: userId}})
          .then((data) => {this.setState({videos: data.data})})
  }

  sendToSelectedVideo(video) {
    this.props.history.push({
        pathname: '/owner/video',
        video: video, 
        userId: this.state.userId
      })
  }

  addVideo(video) {
    axios.post('/owner/save', {video: video, userId: this.state.userId})
    .then(res => {
      this.getUserVideos(this.state.userId)
    })
    .catch(err => {
      console.log(err)
    })
  }

  removeVideo(video) {
    axios.post('/owner/remove', {video: video, userId: this.state.userId})
    .then(res => {
      this.getUserVideos(this.state.userId)
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleViewChange() {
    this.getUserVideos(this.state.userId)
    this.setState({
      view: this.state.view === 'home' ? 'search' : 'home',
      searchedVideos: []
    })
  }

  searchUserVideos(query = '') {
    if (query === '') this.getUserVideos(this.state.userId);
    query = query.toLowerCase();
    const matches = [];
    this.state.videos.forEach(video => {
      let title = video.title.toLowerCase();
      let description = video.description.toLowerCase();
      if (description.indexOf(query) > -1 || title.indexOf(query) > -1) {
        matches.push(video);
      }
    })
    this.setState({videos: matches})
  }

  render () {
    return (
      <Paper style={style} zDepth={1}>
      <div id="owner-homepage-app">
        <header className="navbar"><h1>Hello {this.props.location.username}</h1></header>
        <h3>{this.state.view === 'home' ? 'uploaded videos' : 'search videos'}</h3>
        <div className="main">
        <RaisedButton label={this.state.view === 'home' ? "add videos" : "my videos"} 
        onClick={() => {
          this.handleViewChange()
        }}/>
          <Search getVideos={this.getVideos} view={this.state.view} searchUserVideos={this.searchUserVideos}/>
          <VideoList 
            userId={this.state.userId}
            videos={this.state.view === 'home' ? this.state.videos : this.state.searchedVideos} 
            redirect={this.sendToSelectedVideo}
            view={this.state.view}
            add={this.addVideo}
            remove={this.removeVideo}
          />
        </div>  
      </div>   
      </Paper>
    )
  }
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px',
  background: '#D8E4EA'
}

export default withRouter(OwnerHomepage);