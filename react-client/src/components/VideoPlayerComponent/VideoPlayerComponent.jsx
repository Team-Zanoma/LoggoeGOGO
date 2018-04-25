import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayerComponent = (props) => {
	const options = {
		url: `https://www.youtube.com/watch?v=${ props.videoId }`,
		playing: false,
		className: 'react-player',
		width: '100%',
		height: '100%'

	};

	return (
		<div className="videoWrapper">
			<ReactPlayer { ...options } />
		</div>
	);
};

export default VideoPlayerComponent;