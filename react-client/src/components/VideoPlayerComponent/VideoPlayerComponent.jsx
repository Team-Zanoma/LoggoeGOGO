import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';
import ReactPlayer from 'react-player';

import './VideoPlayerComponent.css';

class VideoPlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: `http://www.youtube.com/watch?v=${ props.videoId }`,
      playing: true,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false
    }
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

  onPlay = () => {
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

	// componentDidMount() {}

  render () {
    const { url, playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state;
    return (
      <div className='app'>
        <section className='section'>
          <div className='player-wrapper'>
            <ReactPlayer
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              playing={playing}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onEnded={this.onEnded}
              onProgress={this.onProgress}
              onDuration={this.onDuration}
            />
          </div>
          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.onClickFullscreen}>Fullscreen</button>
                <button onClick={this.toggleMuted}>{muted ? 'Unmute' : 'Mute'}</button>
                <button onClick={this.Loop}>Loop</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={ this.onSeekMouseDown }
                  onChange={ this.onSeekChange }
                  onMouseUp={ this.onSeekMouseUp }
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress className="position" max={1} value={played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress className="loaded" max={1} value={loaded} /></td>
            </tr>
          </tbody></table>
        </section>
      </div>
    );
  }
};

export default VideoPlayerComponent;