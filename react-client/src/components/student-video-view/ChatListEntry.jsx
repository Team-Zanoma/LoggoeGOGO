import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

class ChatListEntry extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {message, view} = this.props;
    return (
      <Paper style={style}>
        <div>
          <h4 style={{display: 'inline', fontWeight: 'bold'}}>{ message.username }</h4> 
          <p>{ message.message }</p>
        </div>
        <span><i>{moment().fromNow()}</i></span>
      </Paper>
      );
  }
}

const style = {
  width: '80%', 
  margin: '10px', 
  padding: '20px', 
  float: 'left'
}

export default ChatListEntry;