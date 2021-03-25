import React from 'react';
import APIFetch from '../../utilities/api';
import './styles.css'
import MessageList from './MessageList'
import MessageForm from './MessageForm'

export default class Chat extends React.Component{

    DUMMY_DATA = [
        {
          senderId: "perborgen",
          text: "who'll win?"
        },
        {
          senderId: "janedoe",
          text: "idk?"
        }
    ]
  
    constructor(props) {
        super(props);
        this.state = {
            messages: this.DUMMY_DATA,
            status : "loading"
        };
    }

    componentDidMount(){
        let userID1 = localStorage.getItem('id');
        let userID2 = this.props.userID;    // userID of the user you want to chat with
         
        let fetchUrl = '/messages/listChatMessages?userID1=' + userID1 + '&userID2=' + userID2;
        fetchPosts.then(async (data) => {
            if(await data.ok){
                  let messages = await data.json();
                  this.setState({items: messages, status : ""});
            }
            else if (await data.status === 404){
                  this.setState({status : "No messages"});
            }
            else{
                  this.setState({status : "Network Problem"});
            }
        });
    }

    render() {
        let messages = this.state.messages;
        return (
            <div className = 'chat'>
                <MessageList messages = {messages}/>
                <MessageForm />
            </div>
        );
    }
}