import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';
import ReactPlayer from 'react-player';

import './VideoPlayerComponent.css';
import VideoComments from '../student-video-view/VideoComments.jsx';
import FontIcon from 'material-ui/FontIcon';

// https://github.com/CookPete/react-player
// https://css-tricks.com/html5-progress-element/

class VideoPlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: `http://www.youtube.com/watch?v=${ props.videoId }`,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false,
      scrubberWidth: '0px',
      scrubberHeight: '0px'
    }

    this.leftBox = React.createRef();
    this.rightBox = React.createRef();
  }

  playPause = () => {
    this.setState({ playing: !this.state.playing });
  }

  toggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  }

  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  }

  toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  }

  autoPlay = () => {
    this.setState({ playing: true });
  }

  onPause = () => {
    this.setState({ playing: false });
  }

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  }

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
	}

  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
	}

  onEnded = () => {
    this.setState({ playing: this.state.loop });
	}

  onDuration = (duration) => {
    this.setState({ duration });
	}

  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
	}

<<<<<<< HEAD
  ref = player => {
    this.player = player
  }

  getScrubberSize = () => {
    let getHeight = this.leftBox.current.clientHeight + 2;
    let getWidth = this.leftBox.current.clientWidth + this.rightBox.current.clientWidth;
    this.setState({
      scrubberWidth: `calc(100% - ${getWidth}px)`,
      scrubberHeight: `${getHeight}px`
    });
  }

  showComments = () => {
    if (this.props.hasComments) {
      return (
        <section className="section">
          <VideoComments getCommentDetails={ this.getCommentDetails } />
        </section>
      );
    }
    return;
  }

  showController = () => {
    const { playing, muted, loop, played, loaded, scrubberWidth, scrubberHeight } = this.state;

    if (this.props.hasController) {
      return (
        <div className="controllBar">
          <div ref={ this.leftBox }>
            <button onClick={ this.playPause }>{
              playing
                ? (<FontIcon className="material-icons">pause</FontIcon>)
                : (<FontIcon className="material-icons">play_arrow</FontIcon>)
            }</button>
            <button className={ muted ? "iconOn" : "" } onClick={ this.toggleMuted }>
              { <FontIcon className="material-icons">volume_off</FontIcon> }
            </button>
          </div>
          <div
            className="scrubber"
            style={{ width: scrubberWidth, height: scrubberHeight }}
          >
            <div className="container">
              <input
                type='range' min={0} max={1} step='any'
                value={played}
                onMouseDown={ this.onSeekMouseDown }
                onChange={ this.onSeekChange }
                onMouseUp={ this.onSeekMouseUp }
                className="seeker"
              />
              <progress className="position" max={1} value={played} />
              <progress className="loaded" max={1} value={loaded} />
            </div>
          </div>
          <div ref={ this.rightBox }>
            <button onClick={ this.onClickFullscreen }>
              { <FontIcon className="material-icons">fullscreen</FontIcon> }
            </button>
            <button className={ loop ? "iconOn" : "" } onClick={ this.toggleLoop }>
              { <FontIcon className="material-icons">loop</FontIcon> }
            </button>
          </div>
        </div>
      );
    }
    return;
  }

  componentDidMount() {
    if (this.props.hasController) {
      this.getScrubberSize();
      this.setState({ playing: true });
    } else {
      this.setState({ playing: false });
    }
    window.addEventListener('resize', this.getScrubberSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getScrubberSize);
  }

  getCommentDetails = (comment, radioValue) => {
    const timestamp = Math.floor(this.state.playedSeconds);
    this.props.saveComment(timestamp, comment, radioValue);
  }

  render () {
    const { url, playing, volume, muted, loop, played, loaded, duration, playbackRate, scrubberWidth, scrubberHeight } = this.state;
    return (
      <div className='app'>
        <section className='section'>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={ this.ref }
              className='react-player'
              width='100%'
              height='100%'
              url={ url }
              playing={ playing }
              loop={ loop }
              playbackRate={ playbackRate }
              volume={ volume }
              muted={ muted }
              onPlay={ this.onPlay }
              onPause={ this.onPause }
              onEnded={ this.onEnded }
              onProgress={ this.onProgress }
              onDuration={ this.onDuration }
            />
          </div>
          { this.showController() }
        </section>
        { this.showComments() }
      </div>
    );
  }
};

export default VideoPlayerComponent;