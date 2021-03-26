import React from 'react';
import APIFetch from '../../utilities/api';
import './styles.css'
import MessageList from './MessageList'

const URL = 'ws://localhost:3000'

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
        // this.setState(state => ({ messages: [message, ...state.messages]}))
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

				console.log(this.state.messages)
            } else {
                this.setState({message: 'something went wrong'});
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
            this.addMessage(message)
			console.log(message);
        }
      
        this.ws.onclose = () => {
            console.log('disconnected')
        }


		let userID1 = localStorage.getItem('id');
		let userID2 = this.props.userID;    // userID of the user you want to chat with
		 
		let fetchUrl = '/messages/listChatMessages?userID1=' + userID1 + '&userID2=' + userID2;
		let fetchPosts = APIFetch(fetchUrl, null,'GET');
        fetchPosts.then(async (data) => {
			if (await data.ok) {
				let json = await data.json();

				json.sort((first, second) => {
					console.log(first.message,first.timestamp)
					return Date.parse(first.timestamp) - Date.parse(second.timestamp);
				})

				this.setState({messages: json, status : ""});
			} else if (await data.status === 404) {
				this.setState({status : "No messages"});
			} else {
				this.setState({status : "Network Problem"});
			}
		});
	}
    render() {
		let messages = this.state.messages;
		return (
			<div className = 'chat-inner'>
				<MessageList messages = {messages}/>
				<form onSubmit = {this.handle}>
					<input
						onChange = {this.inputMessage}
						placeholder="Type your message"
						type="text"
						value={this.state.sendMessage}
						className="input"
					/>
					<button className="button">Send</button>
        		</form>
				<br/>
			</div>
		);
	}
}