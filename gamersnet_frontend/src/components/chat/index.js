import React from 'react';
import {Link} from 'react-router-dom';
import APIFetch from '../../utilities/api';
import './styles.css'
import MessageList from './MessageList'
import ProfileAvatar from '../profileComponents/profileAvatar';

const URL = `ws://${process.env.REACT_APP_WS_SERVER || 'localhost:3000'}`;

export default class Chat extends React.Component {
    ws = new WebSocket(URL);

	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			status : "loading",
			sendMessage: ""
		};
		this.handle = this.handle.bind(this);
		this.inputMessage = this.inputMessage.bind(this);
	}

    addMessage(message){
		let messages =  this.state.messages;
		messages.push(message);
		this.setState({messages: messages, status : ""});
    }

	inputMessage(event){
        this.setState({sendMessage: event.target.value});
    }


	handle(event) {
        let body = {
            receiver : this.props.userID,
			timestamp : Date.now(),
			message : this.state.sendMessage
        };
        this.setState({sendMessage: ""})
        let fetchData = APIFetch('/messages/addMessage', JSON.stringify(body), 'POST');
		console.log(body)
        fetchData.then(async (data) => {
            if (await data.ok) {
				
				body.sender = localStorage.getItem('id');
				this.ws.send(JSON.stringify({type: "message", receiver: this.props.userID, message : body.message, timestamp : Date.now()}));
				this.addMessage(body)

            }else if (await data.status === 404){
				this.setState({status : "No messages found"});
			} else {
				this.setState({status : "Cannot send message to yourself"});
			}
        });
    
        event.preventDefault();
    }

	componentDidMount(){

        this.ws.onopen = () => {
            // on connecting, send a message indicating who you are, this is useful for 1-to1 chat
            console.log('connected')
            this.ws.send(JSON.stringify({type: "userID", userID: localStorage.getItem('id')}));
        }
      
        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            this.addMessage(message);
			console.log(message);
        }


		let userID1 = localStorage.getItem('id');
		let userID2 = this.props.userID;    // userID of the user you want to chat with
		 
		let fetchUrl = '/messages/listChatMessages?userID1=' + userID1 + '&userID2=' + userID2;
		let fetchPosts = APIFetch(fetchUrl, null,'GET');
        fetchPosts.then(async (data) => {
			if (await data.ok) {
				let json = await data.json();
				json.sort((first, second) => {
					
					let timestamp1 = Date.parse(first.timestamp);
					let timestamp2 = Date.parse(second.timestamp);
					
					if(isNaN(timestamp1)){
						timestamp1 = first.timestamp;
					}
					if(isNaN(timestamp2)){
						timestamp2 = second.timestamp
					}
					return timestamp1 - timestamp2;
				})
				this.setState({messages: json, status : ""});
			} else if (await data.status === 404) {
				this.setState({status : "No messages"});
			} else {
				this.setState({status : "No chats found"});
			}
		});
	}

	componentWillUnmount(){
		this.ws.close();
		this.ws.onclose = function(event) {
            console.log('disconnected')
        };
	}

    render() {
		let messages = this.state.messages;
		return (	
			<div>
				<p>{this.state.status}</p>

				<section class="msger">
  					<header class="msger-header">
    					<div class="msger-header-title">
							<ProfileAvatar userID = {this.props.userID} />
                    		<Link class = "fas fa-comment-alt" to = {`/profile/${this.props.userID}`}>{this.props.username}</Link>
   						</div>
					</header>

				<main className="msger-chat">
					<MessageList messages = {messages}/>
				</main>
				<form onSubmit = {this.handle} className="input-area">
					<input
						onChange = {this.inputMessage}
						placeholder="Type your message"
						type="text"
						value={this.state.sendMessage}
						className="input"
					/>
					<button className="send">Send</button>
				</form>
				</section>
			</div>
			
		);
	}
}
