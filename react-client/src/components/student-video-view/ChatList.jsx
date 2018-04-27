import React from 'react';

import ChatListEntry from './ChatListEntry.jsx';

class ChatList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      items: null
    };
  }
  
  render() {
    return (
      <div>
        <div>
          {this.props.messages.map((message, index) => {
            return (
              <ChatListEntry 
                key={index} 
                message={message}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default ChatList;