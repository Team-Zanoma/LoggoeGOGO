import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const VideoListEntry = ({video, redirect, view, add, remove}) => {
  return (
    <Paper style={style} key={video.id}>
      <div key={video.id} style={{display: 'inline-block'}}>
        <div style={{width: '30%', float: 'left'}}>
          <img onClick={()=>{redirect(video)}} className="media-object" 
            src={view === 'search' ? video.snippet.thumbnails.medium.url : video.image} 
            alt="" />
        </div>
        <div style={{width: '50%', float: 'right'}}>
          <div style={{fontWeight: 'bold'}}> {view === 'search' ? video.snippet.title : video.title} </div>
          <br/>
          <div style={{color: 'grey'}}> {view === 'search' ? video.snippet.description : video.description} </div>
          <RaisedButton label={view === 'search' ? 'add' : 'remove'} 
          onClick={() => {
            view === 'search' ? add(video) : remove(video)
          }}/>
        </div>
      </div>
    </Paper>
  )
}

const style = {
  height: 'auto',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px'
}

export default VideoListEntry;
