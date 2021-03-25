import React from 'react';
import APIFetch from '../../utilities/api';
import {withRouter} from 'react-router-dom';

import './styles.css'
class MessageList extends React.Component{

    render() {
        return (
          <div>
              {this.props.messages.map(message => {
                    let loggedInUserID = localStorage.getItem('id');
                    // if loggedInUserID == message.sender> right align
                    // else left align
                    return (
                      <div className ='chat2'>
                        {message.text}
                      </div>)
                    })
              }
          </div>               
            
        )
    }
}
export default withRouter(MessageList);
